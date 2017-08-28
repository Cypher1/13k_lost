"use strict";

/**
 * User sessions
 * @param {array} users
 */
let users = [];

/**
 * Find opponent for a user
 * @param {User} user
 */
function findOpponent(user) {
  for (let i = 0; i < users.length; i++) {
    if (
      user !== users[i] && 
      users[i].opponent === null
    ) {
      new Game(user, users[i]).start();
    }
  }
}

/**
 * Remove user session
 * @param {User} user
 */
function removeUser(user) {
  users.splice(users.indexOf(user), 1);
}

class Game {
  constructor(user1, user2) {
    this.user1 = user1;
    this.user2 = user2;
  }
  /**
   * Start new game
   */
  start() {
    this.user1.start(this, this.user2);
    this.user2.start(this, this.user1);
  }
  /**
   * Is game ended
   * @return {boolean}
   */
  ended() {
    return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
  }
  
  /**
   * Final score
   */
  score() {
    if (
      this.user1.guess === GUESS_ROCK && this.user2.guess === GUESS_SCISSORS ||
      this.user1.guess === GUESS_PAPER && this.user2.guess === GUESS_ROCK ||
      this.user1.guess === GUESS_SCISSORS && this.user2.guess === GUESS_PAPER
    ) {
      this.user1.win();
      this.user2.lose();
    } else if (
      this.user2.guess === GUESS_ROCK && this.user1.guess === GUESS_SCISSORS ||
      this.user2.guess === GUESS_PAPER && this.user1.guess === GUESS_ROCK ||
      this.user2.guess === GUESS_SCISSORS && this.user1.guess === GUESS_PAPER
    ) {
      this.user2.win();
      this.user1.lose();
    } else {
      this.user1.draw();
      this.user2.draw();
    }
  }
}

/**
 * User session class
 * @param {Socket} socket
 */
class User {
  constructor(socket) {
    this.socket = socket;
    this.game = null;
    this.opponent = null;
    this.guess = GUESS_NO;
  }
  
  /**
   * Set guess value
   * @param {number} guess
   */
  setGuess(guess) {
    if (
      !this.opponent ||
      guess <= GUESS_NO ||
      guess > GUESS_SCISSORS
    ) {
      return false;
    }
    this.guess = guess;
    return true;
  }
  
  /**
   * Start new game
   * @param {Game} game
   * @param {User} opponent
   */
  start(game, opponent) {
    this.game = game;
    this.opponent = opponent;
    this.guess = GUESS_NO;
    this.socket.emit("start");		
  }

  /**
   * Terminate game
   */
  end() {
    this.game = null;
    this.opponent = null;
    this.guess = GUESS_NO;
    this.socket.emit("end");
  }

  win() {
    this.socket.emit("win", this.opponent.guess);
  }

  lose() {
    this.socket.emit("lose", this.opponent.guess);
  }

  draw() {
    this.socket.emit("draw", this.opponent.guess);
  }
}



/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
  let user = new User(socket);
  users.push(user);
  findOpponent(user);

  socket.on("disconnect", function () {
    console.log("Disconnected: " + socket.id);
    removeUser(user);
    if (user.opponent) {
      user.opponent.end();
      findOpponent(user.opponent);
    }
  });

  socket.on("guess", function (guess) {
    console.log("Guess: " + socket.id);
    if (user.setGuess(guess) && user.game.ended()) {
      user.game.score();
      user.game.start();
    }
  });

  console.log("Connected: " + socket.id);
};
