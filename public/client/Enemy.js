'use strict';

const Enemy = (function() {
  const VISION_DISTANCE = 6;

  class Node {
    constructor(x, y, g, parent, goto, dir) {
      Object.assign(this, {
        id: x + ',' + y,
        parent,
        dir,
        x,
        y,
        g, // cost so far
        f: g + Math.abs(goto.x - x) + Math.abs(goto.y - y) // f = g + heuristic
      });
    }

    getNeighbours(goto) {
      let neighbours = [
        {x:this.x - 1, y:this.y,     d:LEFT},
        {x:this.x + 1, y:this.y,     d:RIGHT},
        {x:this.x,     y:this.y - 1, d:UP},
        {x:this.x,     y:this.y + 1, d:DOWN}
      ];

      return neighbours.map(
        n => new Node(n.x, n.y, this.g+1, this, goto, n.d)
      ).filter(
        // exists and is walkable
        node => ($world.grid[node.x] && $world.grid[node.x][node.y] <= GRID_TILES.EMPTY)
      );
    }
  }

  class Enemy extends Player {
    constructor(id, width, height, image, x, y) {
      super(id, width, height, image, x, y);

      this.path = [];
      this.target = $player;
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
      return this[sharedAxis] === this.target[sharedAxis] &&
        axisToCheckLowerBound < axisToCheckUpperBound &&
        axisToCheckUpperBound - axisToCheckLowerBound < VISION_DISTANCE &&
        this.isPlayerInLineOfSight(sharedAxis, axisToCheckLowerBound, axisToCheckUpperBound);
    }

    canSeePlayer() {
      switch (this.direction) {
        case DOWN:
          return this.checkDirection('x', this.y, this.target.y);
        case LEFT:
          return this.checkDirection('y', this.target.x, this.x);
        case RIGHT:
          return this.checkDirection('y', this.x, this.target.x);
        case UP:
          return this.checkDirection('x', this.target.y, this.y);
      }
    }

    reconstructPath(visited, curr) {
      // recreate path
      let path = [];
      while (curr.parent) {
        path.unshift(curr.dir);
        curr = curr.parent;
      }
      this.path = path;
    }

    goTo(x, y) {
      let coords = {x: Math.round(x),y: Math.round(y)};
      let visited = new Map();
      let openList = [new Node(this.x, this.y, 0, null, coords, null)];
      while (openList.length > 0) {
        let curr = openList.shift();
        visited.set(curr.id, curr);


        if ((curr.g > VISION_DISTANCE+3) || (curr.x === coords.x && curr.y === coords.y)){
          this.reconstructPath(visited, curr);
          return;
        }

        for (let neighbour of curr.getNeighbours(coords)) {
          if (!visited.has(neighbour.id)) {
            let sameNodeIndex = openList.findIndex(node => node.id === curr.id);
            if (sameNodeIndex === -1) {
              openList.push(neighbour);
            } else if (neighbour.g < openList[sameNodeIndex].g) {
              openList[sameNodeIndex] = neighbour;
            }
            // sort after edit so that we don't sort when not changing the list
            openList.sort((a, b) => a.f > b.f); // shhh, I'm a priority queue :P
          }
        }
      }
      return [];
    }

    getRandomMove() {
      if (Math.random() < .3) {
        this.direction = Math.floor(Math.random() * 4);
      }
      this.moveDirection(this.direction); // state is now walking (will go back to stopped)
    }

    // don't listen to keyboard events. work out where to go next
    stopped() {
      if(this.path.length > 0) {
        this.moveDirection(this.path.shift(), true);
        this.state();
      } else {
        if (this.canSeePlayer()) {
          console.log('I CAN SEE THE PLAYER');
          this.goTo($player.x, $player.y);
        } else {
          this.getRandomMove();
        }
      }
    }
  }

  return Enemy;
})();
