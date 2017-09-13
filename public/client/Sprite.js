'use strict';

class Sprite {
  /**
   * Constructor
   * @param {Integer} [width] - number of horizontal pixels that make up a sprite segment/tile
   * @param {Integer} [height] - number of vertical pixels that make up a sprite segment/tile
   * @param {Image} [image] - image object of the spritesheet
   * @param {Number} [x] - x position to draw sprite on the canvas
   * @param {Number} [y] - y position to draw sprite on the canvas
   */
  constructor(width, height, image, x, y) {
    Object.assign(this, {
      width,
      height,
      image,
      x,
      y
    });
  }

  /**
   * Sprite does nothing by default
   */
  update() {}

  /**
   * Draw the sprite on the main canvas
   * @param {Integer} [sx] - source x coordinate of the sprite segment to draw
   * @param {Integer} [sy] - source y coordinate of the sprite segment to draw
   */
  render(sx = 0, sy = 0) {
    $context.drawImage(
      this.image,
      sx,
      sy,
      this.width,
      this.height,
      this.x * SQUARE_PIXEL_SIZE,
      this.y * SQUARE_PIXEL_SIZE,
      SQUARE_PIXEL_SIZE,
      SQUARE_PIXEL_SIZE
    );
  }

  shadow() {
    let dx= ($player.x-this.x);
    let dy= ($player.y-this.y);
    let d = 0.01*Math.pow(dx*dx+dy*dy, 1.3);

    $context.globalAlpha = d;
    $context.fillRect(
      this.x * SQUARE_PIXEL_SIZE-0.5,
      this.y * SQUARE_PIXEL_SIZE-0.5,
      SQUARE_PIXEL_SIZE+1,
      SQUARE_PIXEL_SIZE+1
    );
    $context.globalAlpha = 1;
  }
}
