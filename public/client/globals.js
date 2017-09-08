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

var $context,
  $images,
  $player,
  $world,
  $keys = {},
  FRAME_TIME = 55,
  SPRITE_PIXEL_SIZE = 16,
  SQUARE_PIXEL_SIZE = 16,
  NUM_SQUARES = 12,
  SCALE = 2,
  WORLD_SIZE = 100,
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
  WALKING = 1;
