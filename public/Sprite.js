'use strict';

class Sprite {
  constructor(width, height, image, x, y) {
    Object.assign(this, {
      width,
      height,
      image,
      x, // x position on canvas
      y, // y position on canvas
    });
  }

  render(sx = 0, sy = 0) {
    $context.clearRect(0, 0, this.width, this.height);
    $context.drawImage(
      this.image,
      sx,
      sy,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
