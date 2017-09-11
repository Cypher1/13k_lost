const Enemy = (function() {
  const VISION_DISTANCE = 6;

  class Enemy extends AnimatedSprite {
    constructor(width, height, image, x, y) {
      super(width, height, image, x, y);
    }

    isPlayerInLineOfSight(isXAxis, lowerBound, upperBound) {
      const getCellValue = isXAxis
        ? x => $world.grid[x][this.y]
        : y => $world.grid[this.x][y];

      for (let i = lowerBound; i < upperBound; ++i) {
        if (getCellValue(i) !== 0) {
          return false;
        }
      }
      return true;
    };

    checkDirection(sharedAxis, axisToCheckLowerBound, axisToCheckUpperBound) {
      return this[sharedAxis] === $player[sharedAxis] &&
        axisToCheckUpperBound - axisToCheckLowerBound < VISION_DISTANCE &&
        this.isPlayerInLineOfSight(sharedAxis === 'x', axisToCheckLowerBound, axisToCheckUpperBound);
    }

    canSeePlayer() {
      switch(this.direction) {
        case DOWN:
          return this.checkDirection(
            'x'
            this.y,
            $player.y
          );
        case LEFT:
          return this.checkDirection(
            'y'
            $player.x,
            this.x
          );
        case RIGHT:
          return this.checkDirection(
            'y'
            this.x,
            $player.x
          );
        case UP:
          return this.checkDirection(
            'x'
            $player.y,
            this.y
          );
      }
    }

    update()
  }
})();
