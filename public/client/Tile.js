'use strict';

class Tile extends Sprite {
  /**
   * Just like a player, but for immoveable objects
   *
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
    this.isWalking = false;
    this.animation = [1,2,1,0];
    this._stepSize = 1 / (this.animation.length);
  }

  moveDirection(direction) {
    if (this.sy === direction) {
      this.isWalking = true;
    } else {
      this.sy = direction;
    }
  }

  update() {
    this.x = this.x.clamp(0, NUM_SQUARES-1);
    this.y = this.y.clamp(0, NUM_SQUARES-1);
  }

  render() {
    super.render(this.animation[this.sx] * SPRITE_PIXEL_SIZE, this.sy * SPRITE_PIXEL_SIZE);
  }
}
