const Enemy = (function() {
	const VISION_DISTANCE = 6;
	
	class Node {
		constructor(x, y, g, parent) {
			Object.assign(this, {
				id: x + ',' + y,
				parent,
				x,
				y,
				g,	// cost so far
				f: g + Math.abs($player.x - x) + Math.abs($player.y - y)	// f = g + heuristic
			});
		}
	}

  class Enemy extends AnimatedSprite {
    constructor(width, height, image, x, y) {
      super(width, height, image, x, y);

      this.chasingPlayer = false;
    }

    isPlayerInLineOfSight(isXAxis, lowerBound, upperBound) {
      const getCellValue = isXAxis
        ? x => $world.grid[x][this.y]
        : y => $world.grid[this.x][y];

      for (let i = lowerBound; i < upperBound; ++i) {
        if (getCellValue(i) !== 0) {
          return false;
        }
      }
      return true;
    }

    checkDirection(sharedAxis, axisToCheckLowerBound, axisToCheckUpperBound) {
      return this[sharedAxis] === $player[sharedAxis] &&
        axisToCheckUpperBound - axisToCheckLowerBound < VISION_DISTANCE &&
        this.isPlayerInLineOfSight(sharedAxis === 'x', axisToCheckLowerBound, axisToCheckUpperBound);
    }

    canSeePlayer() {
      switch(this.direction) {
        case DOWN:
          return this.checkDirection(
            'x'
            this.y,
            $player.y
          );
        case LEFT:
          return this.checkDirection(
            'y'
            $player.x,
            this.x
          );
        case RIGHT:
          return this.checkDirection(
            'y'
            this.x,
            $player.x
          );
        case UP:
          return this.checkDirection(
            'x'
            $player.y,
            this.y
          );
      }
    }
		
		getMyNeighbours(self) {
			let potentialNeighbours = [
				{x: self.x-1, y: self.y},
				{x: self.x+1, y: self.y},
				{x: self.x, y: self.y-1},
				{x: self.x, y: self.y+1}
			];
			let neighbours = [];
			for (let node of potentialNeighbours) {
				if ($grid[node.x] && $grid[node.x][node.y] <= 0) {	// exists and is walkable
					 neighbours.push(new Node(node.x, node.y, self.g+1, self.id));
				}
			}
			return neighbours;
		}
		
		reconstructPath(visited, curr) {
			// recreate path
      let path = [curr];
      while (curr.parent !== '') {
        curr = visited.get(curr.parent);
        path.push(curr);
      }
      return path;
		}

    moveTowardsPlayer() {
      // A* search. If the player is more than 10 tiles away give up and stop chasing?
			let visited = new Map();
			let openList = [new Node(this.x, this.y, 0, '')];
			
			while (openList.length > 0) {
				openList.sort((a, b) => a.f > b.f); // shhh, I'm a priority queue :P
				
				let curr = openList.shift();
				if (curr.x === $player.x && curr.y === $player.y) {
					return this.reconstructPath(visited, curr);
				}
				visited.set(curr.id, curr);
				
				for (let neighbour of this.getMyNeighbours(curr)) {
					if (! visited.has(neighbour.id)) {
						openList.push(neighbour);
					} else if (neighbour.g < visited.get(neighbour.id).g) {
						visited.set(neighbour.id, neighbour);
					}
				}
			}
    }

    update() {
      if (this.canSeePlayer) {
        this.chasingPlayer = true;
      }

      if (this.chasingPlayer) {
				// Should throttle how often we call A*
        moveTowardsPlayer();
      }
    }
  }
})();
