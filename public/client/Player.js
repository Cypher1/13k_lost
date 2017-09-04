'use strict';

class Player extends Sprite {
  /**
   * Constructor
   * @param {Integer} [id] - id of the player in the game
   * @param {Integer} [width] - number of horizontal pixels that make up a sprite segment/tile
   * @param {Integer} [height] - number of vertical pixels that make up a sprite segment/tile
   * @param {Image} [image] - image object of the spritesheet
   * @param {Number} [x] - x position to draw sprite on the canvas
   * @param {Number} [y] - y position to draw sprite on the canvas
   */
  constructor(id, width, height, image, x, y) {
    super(width, height, image, x, y);

    this.id = id;
    this.sx = 0;
    this.sy = 0;
  }

  update() {
    ++this.sx;

    if ($keys[KEY_CODES.LEFT]) {
      --this.x;
      this.sy = 1;
    } else if ($keys[KEY_CODES.UP]) {
      --this.y;
      this.sy = 3;
    } else if ($keys[KEY_CODES.RIGHT]) {
      ++this.x;
      this.sy = 2;
    } else if ($keys[KEY_CODES.DOWN]) {
      ++this.y;
      this.sy = 0;
    } else {
      --this.sx;
    }
    this.sx = this.sx % 3;
  }
  render() {
    super.render(this.sx * SQUARE_PIXEL_SIZE, this.sy * SQUARE_PIXEL_SIZE);
  }

}
