'use strict';

class AnimatedSprite extends Sprite {
  /**
   * Constructor
   * @param {Integer} [width] - number of horizontal pixels that make up a sprite segment/tile
   * @param {Integer} [height] - number of vertical pixels that make up a sprite segment/tile
   * @param {Image} [image] - image object of the spritesheet
   * @param {Number} [x] - x position to draw sprite on the canvas
   * @param {Number} [y] - y position to draw sprite on the canvas
   */
  constructor(width, height, image, x, y) {
    super(width, height, image, x, y);
    this._sy = 0;
    this._frame = 0;
    this._animation = [0]; /* the current animation */
  }

  /**
   * Set the strip to use a particular animation
   * @param {Integer} [animation] - the ordered list of source x coordinates of the sprite segments to draw
   * @param {Integer} [sy] - source y coordinate of the sprite segment to draw
   * @param {Integer} [frame] - index into the animation to start on (default is 0)
   */
  animate(animation, sy, frame = 0) {
    this._animation = animation;
    this._sy = sy;
    this._frame = frame;
  }

  update() {
    this.nextFrame();
  }

  render() {
    super.render(this._animation[this._frame] * SPRITE_PIXEL_SIZE, this._sy * SPRITE_PIXEL_SIZE);
  }

  /**
   * Move to the next frame of the current animation
   * @return {bool} - true if there was another frame, false if the animation had to loop
   */
  nextFrame() {
    if(++this._frame === this._animation.length) {
      this._frame = 0; // loop
      return false;
    }
    return true;
  }
}
