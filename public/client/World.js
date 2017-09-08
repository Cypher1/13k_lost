
/*
* The grid is represented by a 2D array of integers.
* 0 - The tile is empty
* 1 - The tile is a wall
* 2 - The tile is treasure?
*/

const World = (function() {
  const BIRTH_LIMIT = 4,
    DEATH_LIMIT = 3,
    NUM_SIMULATION_STEPS = 2;

  // Generate random map of size [N, N] filled with Integers
  const repeat = (fn, n) => Array(n).fill().map(fn);
  const randInteger = () => int(Math.random() < .4);
  const randomMap = n => repeat(() => repeat(randInteger, n), n);

  /**
  * Count the number of "alive" neighbour cells.
  * @param {Array<Array<Integer>>} [map] Map containing cells.
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
  };

  /**
  * Performs a single step of the Cellular Automata rules
  * @param {Array<Array<Integer>>} [oldMap] The initial map to perform the iteration on.
  * @returns {Array<Array<Integer>>} The map after a single simulation step
  */
  const doSimulationStep = oldMap =>
    oldMap.map((row, x) =>
      row.map((elem, y) => {
        const numAliveNeighbours = countAliveNeighbours(oldMap, x, y);

        return int(
          elem
            ? numAliveNeighbours >= DEATH_LIMIT
            : numAliveNeighbours > BIRTH_LIMIT
        );
      })
    );

  /**
  * World class containing the map and world game objects.
  */
  class World {
    constructor() {
      this.grid = this.generateMap();
    }

    /**
    * Generates a cave tunnel system using the Cellular Automata ruleset.
    * The map generated is GRID_SIZE width and height.
    * @returns {Array<Array<Integer>>}
    */
    generateMap() {
      let cellmap = randomMap(GRID_SIZE);
      for (let i = 0; i < NUM_SIMULATION_STEPS; ++i) {
        cellmap = doSimulationStep(cellmap);
      }
      return cellmap;
    }

    render() {
      for (let x = 0; x < GRID_SIZE; ++x) {
        for (let y = 0; y < GRID_SIZE; ++y) {
          if (this.grid[x][y]) {
            $context.fillStyle = '#443333';
          } else {
            $context.fillStyle = '#3355AA';
          }
          $context.fillRect(x * SQUARE_PIXEL_SIZE, y * SQUARE_PIXEL_SIZE, SQUARE_PIXEL_SIZE, SQUARE_PIXEL_SIZE);
        }
      }
    }
  }

  // let the World be globally accessible
  return World;
})();
