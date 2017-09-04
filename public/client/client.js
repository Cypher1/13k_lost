'use strict'; // TODO: remove these when we finish dev.

(function() {
  let socket, //Socket.IO client
    canvas = document.getElementById('cvs'),
    IMAGES = ['player.png'];

  $context = canvas.getContext('2d');
  $context.imageSmoothingEnabled = false;

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

  var now,
    last = Date.now();

  function frame() {
    now = Date.now();
    if (now - last >= 50) {
      update();
      last = now;
    }
    render();
    requestAnimationFrame(frame);
  }

  function update() {
    $context.clearRect(0, 0, canvas.width, canvas.height);
    $player.update();
  }

  function render() {
    $player.render();
  }

  function init(result) {
    $images = result;
    // socket = io({upgrade: false, transports: ['websocket']});

    $player = new Player(0, SQUARE_PIXEL_SIZE, SQUARE_PIXEL_SIZE, $images['player.png'], 0, 0);
    requestAnimationFrame(frame);
  }

  loadImages(init);
})();
