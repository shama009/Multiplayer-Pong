function myLogger(string) {
  // console.log(string);
}

let properties = {
  //collection of variable game properties//

  screenWidth: 800,
  screenHeight: 600,

  dashSize: 10,

  paddleVelocity: 600,
  paddleSegmentsMax: 4,
  paddleSegmentHeight: 4,
  paddleSegmentAngle: 15,

  ballVelocity: 500,
  ballStartDelay: 2,
  ballRandomStartingAngleLeft: [
    -120, 120
  ],
  ballRandomStartingAngleRight: [
    -60, 60
  ],
  ballVelocityIncrement: 25,
  ballReturnCount: 4,

  scoreToWin: 3,

  lastKey: 'stationary',

  playerName: '',

  matchWinnerName: '?',
  ratio: '?',
  nameRatioLeft: '?',
  nameRatioRight: '?',

  ///global game state private variables - waiting to be set///
  playerSide: '',
  playerNumber: ''
}

let gameText = {
  //text variables//
  gamePresents: 'UCSD BootCamp Games',
  pong2k: 'if.js',
  enterYourName: 'Enter nickname : ',
  ballOptions: 'Pixel Ball...\n \nCool Ball...\n \nPoop Ball...',
  ballKeyCommands: '[P]\n \n[C]\n \n[K]',
  oneP: 'Single Player\nPress[1]',
  twoP: 'Two Player\nPress [2]',
  instructions: 'BLUE paddle:\n \n UP and DOWN arrow keys.\n \n \n \nFirst to reach\n \n 3 points wins!',
  instructionsLeft: 'Opponent detected!!\n \n \n \nBLUE Paddle:\n \n UP and DOWN arrow keys. \n \n \n \nFirst to reach\n \n 3 points wins!',
  instructionsRight: 'Opponent detected!!\n \n \n \nRED paddle:\n \n UP and DOWN arrow keys.\n \n \n \nFirst to reach\n \n 3 points wins!',
  waiting: 'Waiting for your opponent...',
  winner: 'Win!',
  matchWinner: '   Match Winner: ',
  matchHistory: '    Match History: ',
  newGameInstructions: '   PRESS  [RETURN]'
};

// =============================================================================
// Main Game State
// =============================================================================

let MainState = function(game) {
  //collection of variables used in the game//
  this.backgroundImage
  this.dividingLine;

  this.ball;
  this.ballVelocity;
  // this.ballPositionArray;
  this.randomPositionY;

  //2P
  this.paddle;
  this.paddleOpponent;

  this.paddle_up;
  this.paddle_down;
  //

  //1P
  this.paddleLeft;
  this.paddleRight;

  this.paddleLeft_up;
  this.paddleLeft_down;
  //

  this.missedSide;

  this.scoreLeft;
  this.scoreRight;

  this.scoreLeft_text;
  this.scoreRight_text;

  this.playerNameLeft;
  this.playerNameRight;

  this.soundBallHit;
  this.soundBallBounce;
  this.soundBallMiss;

  this.instructions;
  this.instructionsLeft;
  this.instructionsRight;
  this.winnerLeft;
  this.winnerRight;

  this.music;

  this.timer;
  this.luckyNumber;
  this.randomAngle;

  this.godPower;
};

MainState.prototype = {

  init: function() {
    //keep game running if you open a new window
    game.stage.disableVisibilityChange = true;
  },

  preload: function() {
    //loading all the assets//
    game.load.image('paddleLeft', 'public/assets/image/paddleBlue.png');
    game.load.image('paddleRight', 'public/assets/image/paddleRed.png');

    game.load.image('pixel', 'public/assets/image/ball4.png');
    game.load.image('travo', 'public/assets/image/travo.png');
    game.load.image('cool', 'public/assets/image/cool.png');
    game.load.image('blown', 'public/assets/image/blown.png');
    game.load.image('poop', 'public/assets/image/poop.png');

    game.load.image('background', 'public/assets/image/fancy-court.png');

    game.load.bitmapFont('2P', 'public/assets/font/PressStart2P/2P.png', 'public/assets/font/PressStart2P/2P.xml');

    game.load.audio('soundBallHit', ['public/assets/sound/ballHit.ogg', 'public/assets/sound/ballHit.mp3']);

    game.load.audio('soundBallBounce', ['public/assets/sound/ballBounce.ogg', 'public/assets/sound/ballBounce.mp3']);

    game.load.audio('soundBallMiss', ['public/assets/sound/ballMiss.ogg', 'public/assets/sound/ballMiss.mp3']);

    game.load.audio('airHorn', ['public/assets/sound/airhorn.ogg', 'public/assets/sound/airhorn.mp3']);

    game.load.audio('Fairlight', ['public/assets/sound/WE ARE NEW by FAIRLIGHT(1).ogg', 'public/assets/sound/WE ARE NEW by FAIRLIGHT(1).mp3']);
  },

  create: function() {

    this.godPower = true;

    // this.ballPositionArray = [];
    // myLogger(this.ballPositionArray)

    this.createGraphics();

    if (properties.playerNumber == 1) {
      this.initKeyboard();
      this.startIntro();

      game.time.events.loop(Phaser.Timer.SECOND * 2, this.paddleDelay, this);

    } else if (properties.playerNumber == 2) {
      this.initKeyboard_2P();
      this.startIntro_2P();

      game.time.events.loop(Phaser.Timer.QUARTER * 1, this.updatePaddlePosition, this);

      // game.time.events.loop(Phaser.Timer.QUARTER * .15, this.updateBallPositionArray, this);

      game.time.events.loop(Phaser.Timer.QUARTER * .25, this.updateBallPosition, this);

    }

  },

  update: function() {
    //actions that are updated continually throughout the game//

    game.physics.arcade.overlap(this.ball, [
      this.paddle, this.paddleOpponent, this.paddleLeft, this.paddleRight
    ], this.collideWithPaddle, null, this);

    if (this.ball.body.blocked.up || this.ball.body.blocked.down) {
      game.sound.play('soundBallBounce');
    }

    if (properties.playerNumber == 1) {
      this.moveLeftPaddle();
      this.moveRightPaddle();
    } else if (properties.playerNumber == 2) {
      this.movePaddle();
    }

    // this.updateBallPositionArray();

    if (properties.playerNumber == 2 && this.secretPaddleCombo1.isDown && this.secretPaddleCombo2.isDown && this.secretPaddleCombo3.isDown) {
      this.createGodPaddle();
    }

  },

  updatePaddlePosition: function() {
    // myLogger('updatePaddlePosition');
    var pack = [];
    pack.push({y: this.paddle.y, v: this.paddle.body.velocity.y, id: socket.id});
    socket.emit('updatePaddlePosition', pack);
  },

  receivePaddlePosition: function(data) {
    if (socket.id != data[0].id) {
      this.paddleOpponent.y = data[0].y;
      this.paddleOpponent.body.velocity.y = data[0].v;
      // myLogger('receivePaddlePosition: ' + JSON.stringify(data));
    } else {
      // myLogger('missed connection: receivePaddlePostion')
    }

  },

  updateBallPosition: function() {
    // myLogger("BALL X: " + this.ball.x + "BALL Y: " + this.ball.y + "BALL VELOCITY: " + this.ball.body.velocity)
    if (properties.playerSide == 'left' && this.ball.x < properties.screenWidth / 2) {
      var pack = [];
      pack.push({
        x: Math.round(this.ball.x),
        y: Math.round(this.ball.y),
        velocityX: Math.round(this.ball.body.velocity.x),
        velocityY: Math.round(this.ball.body.velocity.y)
      });
      socket.emit('updateBallPosition', pack);
      // myLogger('updateBallPosition on left: ' + JSON.stringify(pack));
    } else if (properties.playerSide == 'right' && this.ball.x > properties.screenWidth / 2) {
      var pack = [];
      pack.push({
        x: Math.round(this.ball.x),
        y: Math.round(this.ball.y),
        velocityX: Math.round(this.ball.body.velocity.x),
        velocityY: Math.round(this.ball.body.velocity.y)
      });
      socket.emit('updateBallPosition', pack);
      // myLogger('updateBallPosition on right: ' + JSON.stringify(pack));
    }
    // this.ballPositionArray.push([
    //   Math.round(this.ball.x),
    //   Math.round(this.ball.y),
    //   Math.round(this.ball.body.velocity.x),
    //   Math.round(this.ball.body.velocity.y),
    // ]);
    // myLogger("BALL X: " + this.ball.x + "BALL Y: " + this.ball.y + "BALL VELOCITY X: " + this.ball.body.velocity.x + "BALL VELOCITY Y: " + this.ball.body.velocity.y)
  },

  receiveBallPosition: function(data) {
    // myLogger(this.ballPositionArray)
    // myLogger("Array length: " + this.ballPositionArray.length)
    // myLogger('*receiveBallPosition' + JSON.stringify(data));
    // let result = false;
    // for (let b of this.ballPositionArray) {
    //   myLogger("going through the array")
    //   x = b.lastIndexOf(data[0].x);
    //   // myLogger(x)
    //   y = b.lastIndexOf(data[0].y);
    //   // myLogger(y)
    //   velocityX = b.lastIndexOf(data[0].velocityX);
    //   // myLogger(velocityX)
    //   velocityY = b.lastIndexOf(data[0].velocityY);
    //   // myLogger(velocityY)
    //
    //   if (x == 0 && y == 1 && velocityX == 2 && velocityY == 3) {
    //     myLogger("found a true statement")
    //     result = true;
    //     break;
    //   }
    // }
    //
    // if (result == false) {
    //   myLogger("forcing a ball change!!!")
    this.ball.x = data[0].x;
    this.ball.y = data[0].y;
    this.ball.body.velocity.x = data[0].velocityX;
    this.ball.body.velocity.y = data[0].velocityY;
    // }
  },

  // updateBallPositionArray: function () {
  //   this.ballPositionArray.push([
  //     Math.round(this.ball.x),
  //     Math.round(this.ball.y),
  //     Math.round(this.ball.body.velocity.x),
  //     Math.round(this.ball.body.velocity.y),
  //   ]);
  // },

  createGraphics: function() {
    this.music = game.add.audio('Fairlight', 1, true);

    this.backgroundImage = game.add.image(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
    this.dividingLine = this.createDividingLine(0, 0);

    if (properties.playerNumber == 1) {
      this.paddleLeft = this.createPaddleLeft(15, game.world.centerY);
      this.paddleRight = this.createPaddleRight(game.world.width - 15, game.world.centerY);
      this.playerNameLeft = game.add.bitmapText(200, game.world.height - 80, '2P', properties.playerName, 30);
      this.playerNameLeft.anchor.x = 0.5;
      this.playerNameRight = game.add.bitmapText(game.world.width - 200, game.world.height - 80, '2P', 'Bot', 30);
      this.playerNameRight.anchor.x = 0.5;
    } else if (properties.playerSide == 'left') {
      this.paddle = this.createPaddleLeft(15, game.world.centerY);
      this.paddleOpponent = this.createPaddleRight(game.world.width - 15, game.world.centerY);
      this.playerNameLeft = game.add.bitmapText(200, game.world.height - 80, '2P', properties.playerName, 30);
      this.playerNameLeft.anchor.x = 0.5;
      this.playerNameRight = game.add.bitmapText(game.world.width - 200, game.world.height - 80, '2P', '', 30);
      this.playerNameRight.anchor.x = 0.5;
    } else if (properties.playerSide == 'right') {
      this.paddle = this.createPaddleRight(game.world.width - 15, game.world.centerY);
      this.paddleOpponent = this.createPaddleLeft(15, game.world.centerY);
      this.playerNameRight = game.add.bitmapText(game.world.width - 200, game.world.height - 80, '2P', properties.playerName, 30);
      this.playerNameRight.anchor.x = 0.5;
      this.playerNameLeft = game.add.bitmapText(200, game.world.height - 80, '2P', '', 30);
      this.playerNameLeft.anchor.x = 0.5;
    }

    this.scoreLeft_text = game.add.bitmapText(200, 80, '2P', '0', 64);
    this.scoreRight_text = game.add.bitmapText(game.world.width - 200, 80, '2P', '0', 64);

    this.ball = this.createBall(game.world.centerX, game.world.centerY);

    this.instructions = game.add.bitmapText(game.world.centerX, game.world.centerY, '2P', gameText.instructions, 25);
    this.instructions.anchor.set(0.5, 0.5);
    this.instructions.align = 'center';

    this.instructionsLeft = game.add.bitmapText(game.world.centerX, game.world.centerY, '2P', gameText.instructionsLeft, 25);
    this.instructionsLeft.anchor.set(0.5, 0.5);
    this.instructionsLeft.align = 'center';

    this.instructionsRight = game.add.bitmapText(game.world.centerX, game.world.centerY, '2P', gameText.instructionsRight, 25);
    this.instructionsRight.anchor.set(0.5, 0.5);
    this.instructionsRight.align = 'center';

    this.waiting = game.add.bitmapText(game.world.centerX, game.world.centerY, '2P', gameText.waiting, 25);
    this.waiting.anchor.set(0.5, 0.5);
    this.waiting.align = 'center';

    this.winnerLeft = game.add.bitmapText(properties.screenWidth * 0.30, properties.screenHeight * 0.30, '2P', gameText.winner, 30);
    this.winnerLeft.anchor.set(0.5, 0.5);

    this.winnerRight = game.add.bitmapText(properties.screenWidth * 0.80, properties.screenHeight * 0.30, '2P', gameText.winner, 30);
    this.winnerRight.anchor.set(0.5, 0.5);

    this.hideTextFields();
  },

  initKeyboard: function() {
    //keyboard setup//
    this.paddleLeft_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.paddleLeft_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  },

  initKeyboard_2P: function(data) {
    this.paddle_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.paddle_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    this.secretPaddleCombo1 = game.input.keyboard.addKey(Phaser.Keyboard.G);
    this.secretPaddleCombo2 = game.input.keyboard.addKey(Phaser.Keyboard.O);
    this.secretPaddleCombo3 = game.input.keyboard.addKey(Phaser.Keyboard.D);
  },

  createBall: function(x, y) {
    //create ball with physics//
    if (properties.playerNumber == 2) {
      var ball = game.add.sprite(x, y, 'pixel');
      ball.scale.setTo(.5, .5);
      myLogger(ball)
    } else if (this.game.state.states['main']._ballChoice == "pixel") {
      var ball = game.add.sprite(x, y, 'pixel');
      ball.scale.setTo(.5, .5);
      myLogger(ball)
    } else if (this.game.state.states['main']._ballChoice == "cool") {
      var ball = game.add.sprite(x, y, 'cool');
      ball.scale.setTo(.03, .03);
    } else if (this.game.state.states['main']._ballChoice == "poop") {
      var ball = game.add.sprite(x, y, 'poop');
      ball.scale.setTo(.1, .1);
    }
    ball.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(ball);
    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.immovable = true;
    ball.body.bounce.setTo(1, 1);
    ball.events.onOutOfBounds.add(this.ballOutOfBounds, this);

    return ball;
  },

  createDividingLine: function(x, y) {
    this.dividingLine = game.add.graphics(x, y);
    this.dividingLine.lineStyle(5, 0x848484, 1);

    for (let i = 0; i < properties.screenHeight; i += properties.dashSize * 2) {
      this.dividingLine.moveTo(game.world.centerX, i);
      this.dividingLine.lineTo(game.world.centerX, i + properties.dashSize);
    }
  },

  createPaddleLeft: function(x, y) {
    //create left paddle with physics//
    let paddle = game.add.sprite(x, y, 'paddleLeft');
    paddle.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(paddle);
    paddle.checkWorldBounds = true;
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;
    paddle.scale.setTo(0.3, 0.3);

    return paddle;
  },

  createPaddleRight: function(x, y) {
    //create right paddle with physics//
    let paddle = game.add.sprite(x, y, 'paddleRight');
    paddle.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(paddle);
    paddle.checkWorldBounds = true;
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;
    paddle.scale.setTo(0.3, 0.3);

    return paddle;
  },

  createGodPaddle: function() {
    if (this.paddle.x == 15 && this.godPower == true) {
      this.paddle.x = 5;
      this.paddle.scale.setTo(2, 2);
      game.time.events.add(Phaser.Timer.SECOND * 5, this.destroyGodPaddle, this);
      this.updateGodPaddle();
      game.sound.play('airHorn');
    } else if (this.godPower == true) {
      this.paddle.x = game.world.width - 5;
      this.paddle.scale.setTo(2, 2);
      game.time.events.add(Phaser.Timer.SECOND * 5, this.destroyGodPaddle, this);
      this.updateGodPaddle();
      game.sound.play('airHorn');
    }
    this.godPower = false;
  },

  updateGodPaddle() {
    pack = []
    pack.push({x: this.paddle.x})
    socket.emit('updateGodPaddle', pack);
  },

  receiveGodPaddle(data) {
    this.paddleOpponent.x = data[0].x
    this.paddleOpponent.scale.setTo(2, 2);
    game.sound.play('airHorn');
  },

  destroyGodPaddle: function() {
    if (this.paddle.x == 5) {
      this.paddle.x = 15;
    } else {
      this.paddle.x = game.world.width - 15
    }
    this.paddle.scale.setTo(0.3, 0.3);
    this.updateDestroyGodPaddle();
  },

  updateDestroyGodPaddle() {
    pack = []
    pack.push({x: this.paddle.x})
    socket.emit('updateDestroyGodPaddle', pack);
  },

  receiveDestroyGodPaddle(data) {
    this.paddleOpponent.x = data[0].x
    this.paddleOpponent.scale.setTo(0.3, 0.3);
  },

  startIntro: function() {
    //intro screen//
    this.ball.visible = false;
    this.scoreLeft_text.visible = false;
    this.scoreRight_text.visible = false;
    this.playerNameLeft.visible = false;
    this.playerNameRight.visible = false;
    this.instructions.visible = true;
    this.enablePaddles(false);
    this.enableBoundaries(true);
    game.time.events.add(Phaser.Timer.SECOND * 5, this.startGame, this);
  },

  startIntro_2P: function() {
    this.ball.visible = false;
    this.scoreLeft_text.visible = false;
    this.scoreRight_text.visible = false;
    this.scoreRight_text.visible = false;
    this.playerNameLeft.visible = false;
    this.playerNameRight.visible = false;
    this.waiting.visible = true;
    this.enablePaddles_2P(false);
    this.enableBoundaries(true);

    socket.emit('updatePlayer', socket.id);
    myLogger('updatePlayer: ' + JSON.stringify(socket.id));
  },

  receivePlayer: function(data) {
    myLogger("receivePlayer: " + JSON.stringify(data));
    this.waiting.visible = false;

    let socketId = socket.id
    let senderId = data[0].id
    let side = data[0].side

    if ((socketId == senderId && side == "left") || (socketId != senderId && side == "right")) {
      this.instructionsLeft.visible = true;
    } else {
      this.instructionsRight.visible = true;
    }

    game.time.events.add(Phaser.Timer.SECOND * 5, this.startGame, this);
  },

  startGame: function() {
    this.scoreLeft_text.visible = true;
    this.scoreRight_text.visible = true;
    this.playerNameLeft.visible = true;
    this.playerNameRight.visible = true;

    if (properties.playerNumber == 1) {
      this.enablePaddles(true);
      this.resetBall();
    } else if (properties.playerNumber == 2) {
      this.enablePaddles_2P(true);
      this.resetBall_2P();
    }

    this.enableBoundaries(false);
    this.resetScores();
    this.hideTextFields();
    this.updatePlayerName();

    this.ball.visible = false;

    // if (!this.music.isPlaying) {
    //   this.music.play();
    // }

  },

  updatePlayerName: function() {
    myLogger('updatePlayerName')
    socket.emit('updatePlayerName', properties.playerName);
  },

  receivePlayerName: function(data) {
    myLogger('receivePlayerName: ' + data)
    myLogger(this.playerNameLeft.text)
    if (this.playerNameLeft.text.length == 0) {
      myLogger('left update: ' + data)
      this.playerNameLeft.text = data
    } else {
      myLogger('right update: ' + data)
      this.playerNameRight.text = data
    }
  },

  startBall: function() {
    // this.ball.visible = true;
    this.ballVelocity = properties.ballVelocity;
    this.ballReturnCount = 0;

    this.ball.reset(game.world.centerX, game.rnd.between(0, properties.screenHeight));

    game.physics.arcade.velocityFromAngle(this.randomAngle, properties.ballVelocity, this.ball.body.velocity);
  },

  resetBall: function() {
    // this.ball.visible = false;
    // myLogger("ball visibility: " + this.ball.visible);

    // this.randomPositionY = game.rnd.between(0, properties.screenHeight);

    if (this.missedSide == 'right') {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleRight);
    } else if (this.missedSide == 'left') {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleLeft);
    } else {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleRight.concat(properties.ballRandomStartingAngleLeft));
    }

    this.ball.body.velocity.x = 0;
    this.ball.body.velocity.y = 0;

    game.time.events.add(Phaser.Timer.SECOND * properties.ballStartDelay, this.startBall, this);
  },

  resetBall_2P: function() {
    // this.ball.visible = false;
    // myLogger("ball visible: " + this.ball.visible)

    this.randomPositionY = game.rnd.between(0, properties.screenHeight);

    if (this.missedSide == 'right') {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleRight);
    } else if (this.missedSide == 'left') {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleLeft);
    } else {
      this.randomAngle = game.rnd.pick(properties.ballRandomStartingAngleRight.concat(properties.ballRandomStartingAngleLeft));
    }

    this.ball.body.velocity.x = 0;
    this.ball.body.velocity.y = 0;

    game.time.events.add(Phaser.Timer.SECOND * properties.ballStartDelay, this.updateBallLaunchPosition, this);

  },

  updateBallLaunchPosition() {
    myLogger('1_updateBallLaunchPosition');
    const pack = [];
    pack.push({missedSide: this.missedSide, randomAngle: this.randomAngle, randomPositionY: this.randomPositionY});
    socket.emit('updateBallLaunchPosition', pack);
    myLogger('2_updateBallLaunchPosition: ' + JSON.stringify(pack));
  },

  receiveBallLaunchPosition(data) {
    // this.ballPositionArray = [];
    myLogger('1_receiveBallLaunchPosition: ' + JSON.stringify(data));
    myLogger("ball visible: " + this.ball.visible)
    this.ball.reset(game.world.centerX, data[0].randomPositionY);
    this.randomAngle = data[0].randomAngle;

    this.ball.visible = true;
    // myLogger("ball visible: " + this.ball.visible)
    this.ballVelocity = properties.ballVelocity;
    this.ballReturnCount = 0;

    // myLogger("randomAngle: " + this.randomAngle)
    // myLogger(" ballVelocity: " + properties.ballVelocity)
    // myLogger(" this.ball.velocity: " + this.ball.body.velocity)

    game.physics.arcade.velocityFromAngle(this.randomAngle, properties.ballVelocity, this.ball.body.velocity);

    // myLogger("randomAngle: " + this.randomAngle)
    // myLogger(" ballVelocity: " + properties.ballVelocity)
    // myLogger(" this.ball.velocity: " + this.ball.body.velocity)
    // myLogger("this.ball.x: " + this.ball.x);
    // myLogger("this.ball.y: " + this.ball.y);
    // myLogger('2_receiveBallLaunchPosition: ' + JSON.stringify(data));
    myLogger("ball visible: " + this.ball.visible)
  },

  enablePaddles: function(enabled) {
    this.paddleLeft.visible = enabled;
    this.paddleRight.visible = enabled;
    this.paddleRight.visible = enabled;
    this.paddleLeft_up.enabled = enabled;
    this.paddleLeft_down.enabled = enabled;
    this.paddleLeft.y = game.world.centerY;
    this.paddleRight.y = game.world.centerY;
  },

  enablePaddles_2P: function(enabled) {
    this.paddle.visible = enabled;
    this.paddleOpponent.visible = enabled;
    this.paddle_up.enabled = true;
    this.paddle_down.enabled = true;
    this.paddle.y = game.world.centerY;
    this.paddleOpponent.y = game.world.centerY;
  },

  enableBoundaries: function(enabled) {
    game.physics.arcade.checkCollision.left = enabled;
    game.physics.arcade.checkCollision.right = enabled;
  },

  paddleDelay: function() {
    this.timer = 0;
    this.luckyNumber = Math.floor((Math.random() * 25) + 25)
    myLogger("paddle delay")
  },

  moveLeftPaddle: function() {
    if (this.paddleLeft_up.isDown) {
      this.paddleLeft.body.velocity.y = -properties.paddleVelocity;
    } else if (this.paddleLeft_down.isDown) {
      this.paddleLeft.body.velocity.y = properties.paddleVelocity;
    } else {
      this.paddleLeft.body.velocity.y = 0;
    }
  },

  moveRightPaddle: function() {

    let rightDirection = this.ball.body.velocity.x > 0
    this.timer++;

    if (this.timer < this.luckyNumber) {
      this.paddleRight.body.velocity.setTo(this.ball.body.velocity.y);
      this.paddleRight.body.velocity.x = 0;
      this.paddleRight.body.maxVelocity.y = 200;
    } else if (rightDirection) {
      this.paddleRight.body.velocity.setTo(this.ball.body.velocity.y);
      this.paddleRight.body.velocity.x = 0;
      this.paddleRight.body.maxVelocity.y = 500;
    } else {
      this.paddleRight.body.velocity.setTo(this.ball.body.velocity.y);
      this.paddleRight.body.velocity.x = 0;
      this.paddleRight.body.maxVelocity.y = 400;
    }
  },

  movePaddle: function() {
    let newKey;
    if (this.paddle_up.isDown) {
      this.paddle.body.velocity.y = -properties.paddleVelocity;
      newKey = "up";
    } else if (this.paddle_down.isDown) {
      this.paddle.body.velocity.y = properties.paddleVelocity;
      newKey = "down";
    } else {
      this.paddle.body.velocity.y = 0;
      newKey = "stationary"
    }

    if (newKey != properties.lastKey) {
      this.updatePaddlePosition();
      properties.lastKey = newKey;
    }
  },

  collideWithPaddle: function(ball, paddle) {
    game.sound.play('soundBallHit');

    let returnAngle;
    let segmentHit = Math.floor((ball.y - paddle.y) / properties.paddleSegmentHeight);

    if (segmentHit >= properties.paddleSegmentsMax) {
      segmentHit = properties.paddleSegmentsMax - 1;
    } else if (segmentHit <= -properties.paddleSegmentsMax) {
      segmentHit = -(properties.paddleSegmentsMax - 1);
    }

    if (paddle.x < properties.screenWidth * 0.5) {
      returnAngle = segmentHit * properties.paddleSegmentAngle;
      game.physics.arcade.velocityFromAngle(returnAngle, this.ballVelocity, this.ball.body.velocity);
    } else {
      returnAngle = 180 - (segmentHit * properties.paddleSegmentAngle);
      if (returnAngle > 180) {
        returnAngle -= 360;
      }
      game.physics.arcade.velocityFromAngle(returnAngle, this.ballVelocity, this.ball.body.velocity);
    }

    this.ballReturnCount++;

    if (properties.playerNumber == 1 && this.ballReturnCount >= properties.ballReturnCount) {
      this.ballReturnCount = 0;
      this.ballVelocity += properties.ballVelocityIncrement;
    }

    if (this.paddle && (this.paddle.x == paddle.x)) {
      this.updateCollideWithPaddle();
      // this.ballPositionArray = [];
    }
  },

  updateCollideWithPaddle: function() {
    var pack = [];
    pack.push({x: this.ball.x, y: this.ball.y, velocity: this.ball.body.velocity, ballVelocity: this.ballVelocity, id: socket.id});
    socket.emit('updateCollideWithPaddle', pack);
    myLogger('0updateCollideWithPaddle: ' + JSON.stringify(pack));
  },

  receiveCollideWithPaddle: function(data) {
    if (socket.id != data[0].id) {
      this.ball.y = data[0].y;
      this.ball.x = data[0].x;
      this.ball.body.velocity.x = data[0].velocity.x;
      this.ball.body.velocity.y = data[0].velocity.y;
      this.ball.body.velocity.type = data[0].velocity.type;
      this.ballVelocity = data[0].ballVelocity;
      // this.ballReturnCount = data[0].ballReturnCount;
    }
    myLogger('receiveCollideWithPaddle: ' + JSON.stringify(data));
  },

  ballOutOfBounds: function() {
    game.sound.play('soundBallMiss');

    if (properties.playerNumber == 2) {
      if (properties.playerSide == 'left' && this.ball.x < 0) {
        this.missedSide = 'left';
        this.scoreRight++;
        myLogger("score right: " + this.scoreRight)
        myLogger("score left: " + this.scoreLeft)
        this.updateScores();
        this.resetBall_2P();
      } else if (properties.playerSide == 'right' && this.ball.x > properties.screenWidth) {
        this.missedSide = 'right';
        this.scoreLeft++;
        myLogger("score left: " + this.scoreLeft)
        myLogger("score right: " + this.scoreRight)
        this.updateScores();
        this.resetBall_2P();
      }
    } else {
      if (this.ball.x < 0) {
        this.missedSide = 'left';
        this.scoreRight++;
        myLogger("score right: " + this.scoreRight)
      } else if (this.ball.x > properties.screenWidth) {
        this.missedSide = 'right';
        this.scoreLeft++;
        myLogger("score left: " + this.scoreLeft)
      }
      this.updateScoreTextFields();
    }

    if (properties.playerNumber == 1 && this.scoreLeft >= properties.scoreToWin) {
      this.winnerLeft.visible = true;
      this.music.stop();
      game.time.events.add(Phaser.Timer.SECOND * 4, this.startNewGame, this);
    } else if (properties.playerNumber == 1 && this.scoreRight >= properties.scoreToWin) {
      this.winnerRight.visible = true;
      this.music.stop();
      game.time.events.add(Phaser.Timer.SECOND * 4, this.startNewGame, this);
    } else if (properties.playerNumber == 1) {
      this.resetBall();
    }
  },

  updateScores: function() {
    const pack = [];
    pack.push({scoreLeft: this.scoreLeft, scoreRight: this.scoreRight, missedSide: this.missedSide});
    socket.emit('updateScores', pack);
    myLogger('updateScores: ' + JSON.stringify(pack));
  },

  receiveScores: function(data) {
    myLogger('receiveScores: ' + JSON.stringify(data));;
    this.scoreLeft = data[0].scoreLeft;
    this.scoreRight = data[0].scoreRight;
    this.missedSide = data[0].missedSide;
    this.updateScoreTextFields();

    if (this.scoreLeft >= properties.scoreToWin) {
      this.winnerLeft.visible = true;
      this.ball.visible = false;
      this.music.stop();
      this.updateScoreData();
    } else if (this.scoreRight >= properties.scoreToWin) {
      this.winnerRight.visible = true;
      this.ball.visible = false;
      this.music.stop();
      this.updateScoreData();
    }
  },

  updateScoreData: function() {
    if ((properties.playerSide == 'left' && this.scoreLeft == properties.scoreToWin) || (properties.playerSide == 'right' && this.scoreRight == properties.scoreToWin)) {
      var pack = [];
      pack.push({playerNameLeft: this.playerNameLeft.text, playerNameRight: this.playerNameRight.text, scoreRight: this.scoreRight, scoreLeft: this.scoreLeft});
      socket.emit('updateScoreData', pack)
    }
  },

  receiveScoreData: function(data) {
    myLogger("receiveScoreData");
    game.time.events.add(Phaser.Timer.SECOND * 3, this.updateMatchRecord, this);
  },

  updateMatchRecord: function() {
    myLogger('updateMatchRecord');
    var pack = [];
    pack.push({playerNameLeft: this.playerNameLeft.text, playerNameRight: this.playerNameRight.text, scoreLeft: this.scoreLeft, scoreRight: this.scoreRight});
    socket.emit('updateMatchRecord', pack);
  },

  receiveMatchRecord: function(data) {
    myLogger("receiveMatchRecord: " + JSON.stringify(data))

    properties.ratio = data[1].player1_score + "    " + data[1].player2_score;
    properties.nameRatioLeft = data[1].player1
    properties.nameRatioRight = data[1].player2
    if (data[0].scoreLeft > data[0].scoreRight) {
      properties.matchWinnerName = data[0].playerNameLeft;
    } else {
      properties.matchWinnerName = data[0].playerNameRight;
    }
    this.music.stop();
    game.state.start('matchRecordSelect');
  },

  startNewGame: function() {
    game.state.start('playerSelect');
  },

  hideTextFields: function() {
    this.instructions.visible = false;
    this.instructionsRight.visible = false;
    this.instructionsLeft.visible = false;
    this.winnerLeft.visible = false;
    this.winnerRight.visible = false;
    this.waiting.visible = false;
  },

  resetScores: function() {
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.updateScoreTextFields();
  },

  updateScoreTextFields: function() {
    this.scoreLeft_text.text = this.scoreLeft;
    this.scoreRight_text.text = this.scoreRight;
  }
};

const MainStateInstance = new MainState();
