
class Camera {
  constructor(x = 0, y = 0) {
    this.x = x; // x center of camera
    this.y = y; // y center of camera
  }

  clampCoordinate(coordinate) {
    return (coordinate - (CAMERA_SIZE/2)).clamp(0, GRID_SIZE-1 - CAMERA_SIZE);
  }

  update() {
    this.x = this.clampCoordinate($player.x);
    this.y = this.clampCoordinate($player.y);

    $context.setTransform(
      1,
      0,
      0,
      1,
      -this.x * SQUARE_PIXEL_SIZE,
      -this.y * SQUARE_PIXEL_SIZE
    );
  }
}
