'use strict';

const Enemy = (function() {
  const VISION_DISTANCE = 6;
  let enemyType = 0;  // used to change sprites for each enemy

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
      this.walkAnimation = [0,1,2,1,0].map(x => x + (enemyType*3));
      this._stepSize = 1 / this.walkAnimation.length;

      this.animate(this.walkAnimation, this.direction);

      enemyType = (enemyType + 1) % 4;
    }

    reconstructPath(visited, curr) {
      // recreate path
      let path = [];
      while (curr.parent) {
        path.unshift(curr.dir);
        curr = curr.parent;
      }
      return path;
    }

    goTo(x, y) {
      let coords = {x: Math.round(x),y: Math.round(y)};
      let visited = new Map();
      let openList = [new Node(this.x, this.y, 0, null, coords, null)];
      while (openList.length > 0) {
        let curr = openList.shift();
        visited.set(curr.id, curr);


        if ((curr.g > VISION_DISTANCE+4) || (curr.x === coords.x && curr.y === coords.y)){
          this.path = this.reconstructPath(visited, curr);
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
      this.getRandomMove();
    }

    getRandomMove() {
      if (Math.random() < .3) {
        this.direction = Math.floor(Math.random() * 4);
      }
      this.moveDirection(this.direction); // state is now walking (will go back to stopped)
    }

    // don't listen to keyboard events. work out where to go next
    stopped() {
      if(this.path.length === 0 || this.path.length > 10) {
        // looking
        this.goTo($player.x, $player.y);
        if (this.path.length > 10) {
          // we lost them
          this.getRandomMove();
          return this.state();
        } else {
          console.log('I CAN SEE THE PLAYER');
        }
      }
      // chase
      this.moveDirection(this.path.shift(), true);
      this.state();
    }
  }

  return Enemy;
})();
