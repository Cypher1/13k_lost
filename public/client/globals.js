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

var $context,
  $images,
  $player,
  $keys = {},
  SPRITE_PIXEL_SIZE = 16,
  SQUARE_PIXEL_SIZE,
  NUM_SQUARES = 12,
  SCALE = 2,
  KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };
