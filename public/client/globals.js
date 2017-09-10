'use strict';

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns {Number} A number in the range [min, max]
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

/**
 * Returns an array of numbers in a given range (like python range)
 *
 * Example: range(0, 3) gives a generator over [0, 1, 2]
 *
 * @param {Number} s The start value
 * @param {Number} e The end value
 * @param {Number} step The value to increment by (default is 1)
 * @returns {Generator of Number} An generator of numbers in the range [min, max) increasing by step
 */
function* range(s, e, step=1) {
  var i=s;
  while(i<e) {
    yield i;
    i+=step;
  }
}

function GET_DIRECTION() {
  if ($keys[KEY_CODES.LEFT]) {
    return LEFT;
  } else if ($keys[KEY_CODES.UP]) {
    return UP;
  } else if ($keys[KEY_CODES.RIGHT]) {
    return RIGHT;
  } else if ($keys[KEY_CODES.DOWN]) {
    return DOWN;
  }
}

function int(boolVal) {
  return boolVal ? 1 : 0;
}

var $context,
  $images,
  $player,
  $world,
  $camera,
  $keys = {},
  CAMERA_SIZE = 10,
  FRAME_TIME = 55,
  SPRITE_PIXEL_SIZE = 16,
  SQUARE_PIXEL_SIZE = 16,
  SCALE = 2,
  GRID_SIZE = 50,
  KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
  },
  /* DIRECTIONS ARE ALSO INDEXES INTO SPRITES */
  DOWN = 0,
  LEFT = 1,
  RIGHT = 2,
  UP = 3,
  STOPPED = 0,
  WALKING = 1,
  GRID_TILES = {
    /* 0 - The tile is empty (dead) */
    EMPTY: 0,
    /* 1 - The tile is a wall (alive) */
    WALL: 1,
    /* 2 - The tile is treasure */
    TREASURE: 2
  };
