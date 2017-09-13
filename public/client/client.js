'use strict'; // TODO: remove these when we finish dev.

(function() {
  let socket, //Socket.IO client
    canvas = document.getElementById('cvs'),
    IMAGES = ['player', 'enemies', 'earth', 'wall', 'treasure'];

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
    SQUARE_PIXEL_SIZE = size / (CAMERA_SIZE+1);
  }

  var now,
    last = Date.now();

  function frame() {
    now = Date.now();
    if (now - last >= FRAME_TIME && !$game.ended) {
      update();
      last = now;
    }
    render();
    if (!$game.paused) {
      requestAnimationFrame(frame);
    }
  }

  function update() {
    $player.update();
    for (let enemy of $enemies) {
      enemy.update();

      if (Math.abs(enemy.x - $player.x) < .7 && Math.abs(enemy.y - $player.y) < .7) {
        $player.die();
        $game.ended = true;
        setTimeout(function() { alert('refresh to restart') }, 500)
      }
    }

    $camera.update();
  }

  function render() {
    let { width, height } = $context.canvas;
    $context.clearRect(0, 0, width, height);

    //render the world
    $world.render();
    // Draw player
    $player.render();
    for (let enemy of $enemies) {
      enemy.render();
    }
    $world.shadow();
  }

  function init(result) {
    $images = result;

    $world = new World();
    $camera = new Camera();

    var pos = spawnRandomWhere(0, 0, $world.grid.length, $world.grid[0].length);
    $player = new Player(0, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['player'], pos.x, pos.y);

    for (let i of range(0,13)) {
      let enemyPos = spawnRandomWhere(0, 0, $world.grid.length, $world.grid[0].length);
      $enemies.push(new Enemy(i+1, SPRITE_PIXEL_SIZE, SPRITE_PIXEL_SIZE, $images['enemies'], enemyPos.x, enemyPos.y));
    }

    requestAnimationFrame(frame);
  }

  function spawnRandomWhere(sx, sy, ex, ey, f) {
    if(!f) f = pos => $world.grid[pos.x][pos.y] === GRID_TILES.EMPTY;
    var empty = []; // should probably cache this
    for(let x of range(sx,ex)){
      for(let y of range(sy,ey)){
        if(f({x,y})) empty.push({x,y});
      }
    }
    if(empty.length) return empty[Math.floor(Math.random() * empty.length)];
  }

  window.addEventListener('resize', windowResize);

  window.onblur = () => {
    $game.paused = true;
    $keys = {};
  }

  window.onfocus = () => {
    if ($game.paused) {
      $game.paused = false;
      requestAnimationFrame(frame);
    }
  }
  loadImages(init);
})();
