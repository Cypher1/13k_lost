'use strict'; // TODO: remove these when we finish dev.

(function() {
  let socket, //Socket.IO client
    canvas = document.getElementById('cvs'),
    IMAGES = ['player', 'grass', 'long_grass', 'earth'];

  $context = canvas.getContext('2d');
  windowResize();

  /**
   * Load all the required images / sprites
   * @param {Function} [callback] when the last image is loaded.
   */
  function loadImages(callback) {
    let numImages = IMAGES.length,
      result = {},
      onload = () => !--numImages && callback(result); // only call the callback when all images are loaded.

    for (let name of IMAGES) {
      result[name] = new Image();
      result[name].src = 'img/' + name + '.png';
      result[name].onload = onload;
    }
  }

  function windowResize() {
    let size = GRID_SIZE * Math.floor(Math.min(window.innerWidth, window.innerHeight) / GRID_SIZE);
    $context.canvas.width = size;
    $context.canvas.height = size;
    $context.imageSmoothingEnabled = false;
    SQUARE_PIXEL_SIZE = size / GRID_SIZE;
  }

  var now,
    last = Date.now();

  function frame() {
    now = Date.now();
    if (now - last >= FRAME_TIME) {
      update();
      last = now;
    }
    render();
    requestAnimationFrame(frame);
  }

  function update() {
    $player.update();
  }

  function render() {
    let { width, height } = $context.canvas;
    $context.clearRect(0, 0, width, height);

    //render the world
    $world.render();
    // Draw player
    $player.render();
  }

  function init(result) {
    $images = result;
    // socket = io({upgrade: false, transports: ['websocket']});

    $player = new Player(0, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['player'], 0, 0);
    /*    var grass = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['grass'], 0, 0);
    var earth1 = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['earth'], 0, 1);
    var earth2 = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['earth'], 1, 1);
    var long_grass = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['long_grass'], 1, 0);
    long_grass.animate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], 0);
    $world = [grass, long_grass, earth1, earth2];*/
    $world = new World();

    var pos = spawnRandomWhere(0, 0, $world.grid.length, $world.grid[0].length);

    $player = new Player(0, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['player'], pos.x, pos.y);
    requestAnimationFrame(frame);
  }

  function spawnRandomWhere(sx, sy, ex, ey, f) {
    if(!f) f = pos => $world.grid[pos.x][pos.y] === GRID_TILES.EMPTY;
    var empty = []; // should probably cache this
    Array.range(sx, ex).forEach(
      x => Array.range(sy, ey).forEach(
        y => f({x,y}) && empty.push({x,y})
      )
    );
    if(empty.length) return empty[Math.floor(Math.random() * empty.length)];
  }

  window.addEventListener('resize', windowResize);
  loadImages(init);
})();
