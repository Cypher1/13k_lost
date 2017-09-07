'use strict';

const World = (function() {
  const BIRTH_LIMIT = 4,
    DEATH_LIMIT = 3,
    NUM_SIMULATION_STEPS = 3;

  // Generate random map of size [N, N] filled with Booleans
  const repeat = (fn, n) => Array(n).fill().map(fn);
  const randBool = () => Math.random() < .5;
  const randomMap = n => repeat(() => repeat(randBool, n), n);

  /**
  * Count the number of "alive" neighbour cells.
  * @param {Array<Array<Boolean>>} [map] Map containing cells.
  * @param {Integer} [x] x co-ordinate of the cell to check the neighbours of.
  * @param {Integer} [y] y co-ordinate of the cell to check the neighbours of.
  * @returns {Integer} Number of cells alive in the ring around the cell (x,y)
  */
  const countAliveNeighbours = (map, x, y) => {
    let count = 0;

    for (let neighbourX = x-1; neighbourX < x+2; ++neighbourX) {
      for (let neighbourY = y-1; neighbourY < y+2; ++neighbourY) {
        if (neighbourX === x && neighbourY === y){
          // If we're looking at the middle point do nothing, we don't want to add ourselves in!

        } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= map.length || neighbourX >= map[0].length) {
          // In case the index we're looking at it off the edge of the map
          ++count;

        } else if(map[neighbourX][neighbourY]) {
          // Otherwise, a normal check of the neighbour
          ++count;
        }
      }
    }
    return count;
  }

  /**
  * Performs a single step of the Cellular Automata rules
  * @param {Array<Array<Boolean>>} [oldMap] The initial map to perform the iteration on.
  * @returns {Array<Array<Boolean>>} The map after a single simulation step
  */
  const doSimulationStep = oldMap =>
    oldMap.map((row, x) =>
      row.map((elem, y) => {
        const numAliveNeighbours = countAliveNeighbours(oldMap, x, y);

        return elem
          ? numAliveNeighbours >= DEATH_LIMIT
          : numAliveNeighbours > BIRTH_LIMIT;
      })
    );

  /**
  * World class containing the map and world game objects.
  */
  class World {
    constructor() {
      this.grid = this.generateMap();
    }

    generateMap() {
      let cellmap = randomMap(WORLD_SIZE);
      for (let i = 0; i < NUM_SIMULATION_STEPS; ++i) {
        cellmap = doSimulationStep(cellmap);
      }
      return cellmap;
    }
  }
  return World;
})();
