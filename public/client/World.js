
/*
 * The grid is represented by a 2D array of integers.
 * See GRID_TILES in globals.js for the codes of each tile
 */

const World = (function() {
  const BIRTH_LIMIT = 4,
    DEATH_LIMIT = 3,
    NUM_SIMULATION_STEPS = 2,
    TREASURE_PLACEMENT_REQUIREMENT = 5; // number of wall cells must be around a treasure


  // Generate random map of size [N, N] filled with Integers
  const repeat = (fn, n) => Array(n).fill().map(fn);
  const randInteger = () => int(Math.random() < .37);
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
        if (neighbourX === x && neighbourY === y) {
          // Don't count ourselves as a neighbour

        } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= map.length || neighbourX >= map[0].length) {
          // In case the index we're looking at it is off the edge of the map
          ++count;

        } else if (map[neighbourX][neighbourY] === GRID_TILES.WALL) {
          // Otherwise, just check if the neighbour is alive
          ++count;
        } else if (map[neighbourX][neighbourY] === GRID_TILES.TREASURE) {
          // If there is a treasure stop counting. This should only happen when placing treasure!
          return count;
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

  function placeTreasure(grid) {
    for (let x = 0; x < GRID_SIZE; ++x) {
      for (let y = 0; y < GRID_SIZE; ++y) {
        if (!grid[x][y]) {
          if(countAliveNeighbours(grid, x, y) >= TREASURE_PLACEMENT_REQUIREMENT) {
            grid[x][y] = GRID_TILES.TREASURE;
          }
        }
      }
    }
    return grid;
  }

  /**
   * World class containing the map and world game objects.
   */
  class World {
    constructor() {
      this.grid = this.generateMap();
      this.tiles = [
        new Sprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['earth'], -1, -1),     // Cave floor
        new Sprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['wall'], -1, -1),      // Wall
        new Sprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['treasure'], -1, -1),  // Treasure
      ];
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
      return placeTreasure(cellmap);
    }

    do(f) {
      for (let x = $camera.minX; x < $camera.maxX; ++x) {
        for (let y = $camera.minY; y < $camera.maxY; ++y) {
          let tile = this.tiles[this.grid[x][y]];
          tile.x = x;
          tile.y = y;
          f(tile);
        }
      }
    }

    render() {
      this.do(tile => tile.render());
    }

    shadow() {
      this.do(tile => tile.shadow());
    }
  }

  // let the World be globally accessible
  return World;
})();
