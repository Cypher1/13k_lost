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
    this.isWalking = false;
    this.walkAnimation = [1,2,1,0];
    this._stepSize = 1 / (this.walkAnimation.length)
  }

  moveDirection(direction) {
    if (this.sy === direction) {
      this.isWalking = true;
    } else {
      this.sy = direction;
    }
  }

  update() {
    if (!this.isWalking) {

      if ($keys[KEY_CODES.LEFT]) {
        this.moveDirection(1);
      } else if ($keys[KEY_CODES.UP]) {
        this.moveDirection(3);
      } else if ($keys[KEY_CODES.RIGHT]) {
        this.moveDirection(2);
      } else if ($keys[KEY_CODES.DOWN]) {
        this.moveDirection(0);
      } else {
        this.isWalking = false;
      }
    }

    if (this.isWalking) {
      switch (this.sy) {
        case 0:
          this.y += this._stepSize;
          break;
        case 1:
          this.x -= this._stepSize;
          break;
        case 2:
          this.x += this._stepSize;
          break;
        case 3:
          this.y -= this._stepSize;
      }
      if (++this.sx === this.walkAnimation.length) {
        this.isWalking = false;
        this.sx = 0;

      }
    } else {
      this.isWalking = false;
    }
    this.x = this.x.clamp(0, NUM_SQUARES-1);
    this.y = this.y.clamp(0, NUM_SQUARES-1);
  }

  render() {
    super.render(this.walkAnimation[this.sx] * SPRITE_PIXEL_SIZE, this.sy * SPRITE_PIXEL_SIZE);
  }
}
