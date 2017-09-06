'use strict'; // TODO: remove these when we finish dev.

(function() {
  let socket, //Socket.IO client
    canvas = document.getElementById('cvs'),
    IMAGES = ['player.png'];

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
      result[name].src = 'img/' + name;
      result[name].onload = onload;
    }
  }

  function windowResize() {
    let size = NUM_SQUARES * Math.floor(Math.min(window.innerWidth, window.innerHeight) / NUM_SQUARES);
    $context.canvas.width = size;
    $context.canvas.height = size;
    $context.imageSmoothingEnabled = false;
    SQUARE_PIXEL_SIZE = size / NUM_SQUARES
  }

  var now,
    last = Date.now();

  function frame() {
    now = Date.now();
    if (now - last >= 70) {
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
    $context.fillRect(0,0, width, height)
    $player.update();
  }

  function render() {
    $player.render();
  }

  function init(result) {
    $images = result;
    // socket = io({upgrade: false, transports: ['websocket']});

    $player = new Player(0, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['player.png'], 0, 0);
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', windowResize);
  loadImages(init);
})();
