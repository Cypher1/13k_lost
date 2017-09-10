'use strict';

class Player extends AnimatedSprite {
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
    this.state = this.stopped;
    this.direction = DOWN;
    this.walkAnimation = [1,2,1,0];
    this._stepSize = 1 / (this.walkAnimation.length);

    this.animate(this.walkAnimation, this.direction);
  }

update() {
    this.state();

    this.x = this.x.clamp(0, GRID_SIZE-1);
    this.y = this.y.clamp(0, GRID_SIZE-1);
  }

  moveDirection(direction) {
    if (this.direction === direction) {
      this.state = this.walking;
    }
    this.animate(this.walkAnimation, direction);
    this.direction = direction;
  }

  stopped() {
    var dir = GET_DIRECTION();
    if(dir !== undefined) {
      this.moveDirection(dir);
    }

    if(this.state === this.walking) {
      /* start walking straight away */
      this.walking();
    }
  }

  walking() {
    switch (this.direction) {
      case UP:
        this.y -= this._stepSize;
        if ($world.grid[this.x][Math.floor(this.y).clamp(0, GRID_SIZE-1)] === 1) {
          this.y += this._stepSize;
        }
        break;
      case DOWN:
        this.y += this._stepSize;
        if ($world.grid[this.x][Math.ceil(this.y).clamp(0, GRID_SIZE-1)] === 1) {
          this.y -= this._stepSize;
        }
        break;
      case LEFT:
        this.x -= this._stepSize;
        if ($world.grid[Math.floor(this.x).clamp(0, GRID_SIZE-1)][this.y] === 1) {
          this.x += this._stepSize;
        }
        break;
      case RIGHT:
        this.x += this._stepSize;
        if ($world.grid[Math.ceil(this.x).clamp(0, GRID_SIZE-1)][this.y] === 1) {
          this.x -= this._stepSize;
        }
        break;
    }

    if (!this.nextFrame()) {
      this.state = this.stopped;
    }
  }
}
