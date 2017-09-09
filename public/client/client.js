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
    let size = NUM_SQUARES * Math.floor(Math.min(window.innerWidth, window.innerHeight) / NUM_SQUARES);
    $context.canvas.width = size;
    $context.canvas.height = size;
    $context.imageSmoothingEnabled = false;
    SQUARE_PIXEL_SIZE = size / NUM_SQUARES;
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
    let { width, height } = $context.canvas;

    $context.clearRect(0, 0, width, height);
    $context.fillStyle = '#E7F5FE';
    $context.fillRect(0,0, width, height);

    $world.forEach((sprite) => sprite.update());
    $player.update();
  }

  function render() {
    //render the world
    $world.forEach((sprite) => sprite.render());
    // and the players on top
    $player.render();
    // and ui on top of that?
  }

  function init(result) {
    $images = result;
    // socket = io({upgrade: false, transports: ['websocket']});

    $player = new Player(0, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['player'], 0, 0);
    var grass = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['grass'], 0, 0);
    var earth1 = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['earth'], 0, 1);
    var earth2 = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['earth'], 1, 1);
    var long_grass = new AnimatedSprite(SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['long_grass'], 1, 0);
    long_grass.animate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], 0);
    $world = [grass, long_grass, earth1, earth2];
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', windowResize);
  loadImages(init);
})();
