"use strict";

(function() {
  class Sprite {
    constructor(context, width, height, image) {
      let img = new Image();
      img.src = "img/" + image;
      img.onload = () => {
        this.render();
      }
      context.imageSmoothingEnabled = false;

      Object.assign(this, {
        context,
        width,
        height,
        image: img,
        currentFrame: 0,
        countUp: true
      });
    }

    update() {
      if (this.countUp) {
         ++this.currentFrame;
         if (this.currentFrame === 2) {
            this.countUp = false;
         }
      } else {
         --this.currentFrame; // TODO: not hardcode width of this to 3?
         if (this.currentFrame === 0) {
            this.countUp = true;
         }
      }

    }

    render() {
      this.context.clearRect(x, 0, this.width*2, this.height*2);
      x += SQUARE_PIXEL_SIZE / 2
      this.context.drawImage(
         this.image,
         this.currentFrame * this.width,
         SQUARE_PIXEL_SIZE*2,  // we can change this by a multiple of 16 to change direction of avatar
         this.width,
         this.height,
         x,
         0,
         this.width * 2,
         this.height * 2
      );
    }
  }

  var socket, //Socket.IO client
    buttons, //Button elements
    message, //Message element
    score, //Score element
    points = { //Game points
      draw: 0,
      win: 0,
      lose: 0
    },
    canvas,
    player,
    x = 0;

  /**
   * Disable all button
   */
  function disableButtons() {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("disabled", "disabled");
    }
  }

  /**
   * Enable all button
   */
  function enableButtons() {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeAttribute("disabled");
    }
  }

  /**
   * Set message text
   * @param {string} text
   */
  function setMessage(text) {
    message.innerHTML = text;
  }

  /**
   * Set score text
   * @param {string} text
   */
  function displayScore(text) {
    score.innerHTML = [
      "<h2>" + text + "</h2>",
      "Won: " + points.win,
      "Lost: " + points.lose,
      "Draw: " + points.draw
    ].join("<br>");
  }

  /**
   * Binde Socket.IO and button events
   */
  function bind() {

    socket.on("start", function() {
      enableButtons();
      setMessage("Round " + (points.win + points.lose + points.draw + 1));
    });

    socket.on("win", function() {
      points.win++;
      displayScore("You win!");
    });

    socket.on("lose", function() {
      points.lose++;
      displayScore("You lose!");
    });

    socket.on("draw", function() {
      points.draw++;
      displayScore("Draw!");
    });

    socket.on("end", function() {
      disableButtons();
      setMessage("Waiting for opponent...");
    });

    socket.on("connect", function() {
      disableButtons();
      setMessage("Waiting for opponent...");
    });

    socket.on("disconnect", function() {
      disableButtons();
      setMessage("Connection lost!");
    });

    socket.on("error", function() {
      disableButtons();
      setMessage("Connection error!");
    });

    for (var i = 0; i < buttons.length; i++) {
      (function(button, guess) {
        button.addEventListener("click", function(e) {
          disableButtons();
          socket.emit("guess", guess);
        }, false);
      })(buttons[i], i + 1);
    }
  }

  function gameLoop() {
    setTimeout(function() {
      player.update();
      player.render();
      window.requestAnimationFrame(gameLoop);
   }, 200); // controlling the game speed / FPS

  }

  /**
   * Client module init
   */
  function init() {
    socket = io({upgrade: false, transports: ["websocket"]});
    buttons = document.getElementsByTagName("button");
    message = document.getElementById("message");
    score = document.getElementById("score");
    canvas = document.getElementById("cvs");
    canvas.width = 500;
    canvas.height = 500;
    player = new Sprite(canvas.getContext("2d"), SQUARE_PIXEL_SIZE, SQUARE_PIXEL_SIZE, "player.png");
    gameLoop();
    disableButtons();
    bind();
  }

  window.addEventListener("load", init, false);

})();
