'use strict';

const Enemy = (function() {
  const VISION_DISTANCE = 6;

  class Node {
    constructor(x, y, g, parent, dir) {
      Object.assign(this, {
        id: x + ',' + y,
        parent,
        dir,
        x,
        y,
        g, // cost so far
        f: g + Math.abs(Math.round($player.x) - x) + Math.abs(Math.round($player.y) - y) // f = g + heuristic
      });
    }
  }

  class Enemy extends Player {
    constructor(id, width, height, image, x, y) {
      super(id, width, height, image, x, y);

      this.chasingPlayer = false;
      this.walkAnimation = [6,7,8,7,6];
      this._stepSize = 1 / this.walkAnimation.length;

      this.animate(this.walkAnimation, this.direction);
    }

    isPlayerInLineOfSight(sharedAxis, lowerBound, upperBound) {
      let getCellValue = sharedAxis === 'y'
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
      return this[sharedAxis] === this.playerCoords[sharedAxis] &&
        axisToCheckLowerBound < axisToCheckUpperBound &&
        axisToCheckUpperBound - axisToCheckLowerBound < VISION_DISTANCE &&
        this.isPlayerInLineOfSight(sharedAxis, axisToCheckLowerBound, axisToCheckUpperBound);
    }

    canSeePlayer() {
      switch (this.direction) {
        case DOWN:
          return this.checkDirection('x', this.y, this.playerCoords.y);
        case LEFT:
          return this.checkDirection('y', this.playerCoords.x, this.x);
        case RIGHT:
          return this.checkDirection('y', this.x, this.playerCoords.x);
        case UP:
          return this.checkDirection('x', this.playerCoords.y, this.y);
      }
    }

    getMyNeighbours(self) {
      let potentialNeighbours = [
        {
          x: self.x - 1,
          y: self.y,
          dir: LEFT
        }, {
          x: self.x + 1,
          y: self.y,
          dir: RIGHT
        }, {
          x: self.x,
          y: self.y - 1,
          dir: UP
        }, {
          x: self.x,
          y: self.y + 1,
          dir: DOWN
        }
      ];

      let neighbours = [];
      for (let node of potentialNeighbours) {
        if ($world.grid[node.x] && $world.grid[node.x][node.y] <= 0) { // exists and is walkable
          neighbours.push(new Node(node.x, node.y, self.g + 1, self.id, node.dir));
        }
      }
      return neighbours;
    }

    reconstructPath(visited, curr) {
      // recreate path
      let path = [curr];
      while (curr.parent !== '') {
        curr = visited.get(curr.parent);
        path.unshift(curr);
      }
      return path[1];
    }

    searchForPlayer() {
      let visited = new Map();
      let openList = [new Node(this.x, this.y, 0, '', null)];
      while (openList.length > 0) {
        openList.sort((a, b) => a.f > b.f); // shhh, I'm a priority queue :P

        let curr = openList.shift();

        if (curr.g > VISION_DISTANCE+3) {
          return
        }
        if (curr.x === this.playerCoords.x && curr.y === this.playerCoords.y) {
          return this.reconstructPath(visited, curr);
        }

        visited.set(curr.id, curr);

        for (let neighbour of this.getMyNeighbours(curr)) {
          if (!visited.has(neighbour.id)) {
            let sameNodeIndex = openList.findIndex(node => node.id === curr.id);
            if (sameNodeIndex === -1) {
              openList.push(neighbour);
            } else if (neighbour.g < openList[sameNodeIndex].g) {
              openList[sameNodeIndex] = neighbour;
            }
          }
        }
      }
    }

    randomMove() {
      if (Math.random() < .3) {
        this.moveDirection(Math.floor(Math.random() * 4));
      } else {
        this.moveDirection(this.direction);
      }
    }

    // don't listen to keyboard events. do nothing when stopped
    stopped() {}

    update() {
      this.playerCoords = {
        x: Math.round($player.x),
        y: Math.round($player.y)
      }
      if (this.state === this.stopped) {
        if (this.canSeePlayer()) {
          console.log('I CAN SEE THE PLAYER');
          this.chasingPlayer = true;
        } else {
          this.randomMove();
        }

        if (this.chasingPlayer) {

          console.log('running A*');
          let nextMove = this.searchForPlayer();
          if (nextMove) {
            this.moveDirection(nextMove.dir);
          } else {
            this.randomMove();
          }
        }
      }

      super.update();
    }
  }

  return Enemy;
})();
