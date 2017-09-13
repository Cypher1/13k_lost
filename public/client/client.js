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

    if ($world.grid[Math.round($player.x)][Math.round($player.y)] === GRID_TILES.TREASURE) {
      $world.grid[Math.round($player.x)][Math.round($player.y)] = 0;
      let elem = document.getElementById('chests');
      elem.innerHTML = ++$game.chests;
    }

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
    $camera.minX = Math.floor($camera.x).clamp(0, GRID_SIZE);
    $camera.minY = Math.floor($camera.y).clamp(0, GRID_SIZE);
    $camera.maxX = Math.ceil($camera.x + CAMERA_SIZE+1).clamp(0, GRID_SIZE);
    $camera.maxY = Math.ceil($camera.y + CAMERA_SIZE+1).clamp(0, GRID_SIZE);

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

    music();
    $playMusic();

    requestAnimationFrame(frame);
  }

  function music() {
    // create the audio context
    var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext,
      // get the current Web Audio timestamp (this is when playback should begin)
      when = ac.currentTime,
      // set the tempo
      tempo = 132,
      // initialize some vars
      sequence1,
      sequence2,
      sequence3,
      // create an array of "note strings" that can be passed to a sequence
      lead = [
        '-   e',
        'Bb3 e',
        'A3  e',
        'Bb3 e',
        'G3  e',
        'A3  e',
        'F3  e',
        'G3  e',

        'E3  e',
        'F3  e',
        'G3  e',
        'F3  e',
        'E3  e',
        'F3  e',
        'D3  q',

        '-   e',
        'Bb3 s',
        'A3  s',
        'Bb3 e',
        'G3  e',
        'A3  e',
        'G3  e',
        'F3  e',
        'G3  e',

        'E3  e',
        'F3  e',
        'G3  e',
        'F3  e',
        'E3  s',
        'F3  s',
        'E3  e',
        'D3  q'
      ],
      harmony = [
        '-   e',
        'D4  e',
        'C4  e',
        'D4  e',
        'Bb3 e',
        'C4  e',
        'A3  e',
        'Bb3 e',

        'G3  e',
        'A3  e',
        'Bb3 e',
        'A3  e',
        'G3  e',
        'A3  e',
        'F3  q',

        '-   e',
        'D4  s',
        'C4  s',
        'D4  e',
        'Bb3 e',
        'C4  e',
        'Bb3 e',
        'A3  e',
        'Bb3 e',

        'G3  e',
        'A3  e',
        'Bb3 e',
        'A3  e',
        'G3  s',
        'A3  s',
        'G3  e',
        'F3  q'
      ],
      bass = [
        'D3  q',
        '-   h',
        'D3  q',

        'A2  q',
        '-   h',
        'A2  q',

        'Bb2 q',
        '-   h',
        'Bb2 q',

        'F2  h',
        'A2  h'
      ];

    // create 3 new sequences (one for lead, one for harmony, one for bass)
    sequence1 = new TinyMusic.Sequence( ac, tempo, lead );
    sequence2 = new TinyMusic.Sequence( ac, tempo, harmony );
    sequence3 = new TinyMusic.Sequence( ac, tempo, bass );

    // set staccato and smoothing values for maximum coolness
    sequence1.staccato = 0.55;
    sequence2.staccato = 0.55;
    sequence3.staccato = 0.05;
    sequence3.smoothing = 0.4;

    // adjust the levels so the bass and harmony aren't too loud
    sequence1.gain.gain.value = 1.0 / 2;
    sequence2.gain.gain.value = 0.8 / 2;
    sequence3.gain.gain.value = 0.65 / 2;

    // apply EQ settings
    sequence1.mid.frequency.value = 800;
    sequence1.mid.gain.value = 3;
    sequence2.mid.frequency.value = 1200;
    sequence3.mid.gain.value = 3;
    sequence3.bass.gain.value = 6;
    sequence3.bass.frequency.value = 80;
    sequence3.mid.gain.value = -6;
    sequence3.mid.frequency.value = 500;
    sequence3.treble.gain.value = -2;
    sequence3.treble.frequency.value = 1400;
    // play
    $playMusic = () => {
      when = ac.currentTime;
      //start the lead part immediately
      sequence1.play( when );
      // delay the harmony by 16 beats
      sequence2.play( when + ( 60 / tempo ) * 16 );
      // start the bass part immediately
      sequence3.play( when );
    }

    // pause
    $pauseMusic = () => {
      sequence1.stop();
      sequence2.stop();
      sequence3.stop();
    }
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
