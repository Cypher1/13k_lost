'use strict';

(function() {
  let socket, //Socket.IO client
    canvas = document.getElementById('cvs'),
    player,
    IMAGES = [ 'player.png' ];

  $context = canvas.getContext('2d');
  $context.imageSmoothingEnabled = false;

  /**
   * Load all the required images / sprites
   * @param {Function} [callback] when the last image is loaded.
   */
  function loadImages(callback) {
    let numImages = IMAGES.length,
      result = {},
      onload = () => !--numImages && callback(result);  // only call the callback when all images are loaded.

    for (let name of IMAGES) {
      result[name] = new Image();
      result[name].src = 'img/'+name;
      result[name].onload = onload;
    }
  }

  function gameLoop() {
    setTimeout(function() {
      player.render();
      window.requestAnimationFrame(gameLoop);
    }, 200); // controlling the game speed / FPS
  }

  /**
   * Client module init
   */
  function init(result) {
    $images = result;
    console.log($images);
    // socket = io({upgrade: false, transports: ['websocket']});

    player = new Sprite(SQUARE_PIXEL_SIZE, SQUARE_PIXEL_SIZE, $images['player.png'], 0, 0);
    gameLoop();
  }


  loadImages(init);
})();
