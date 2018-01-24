// =============================================================================
// Player Select Game State
// =============================================================================

WebFontConfig = {
  google: {
    families: ['Press Start 2P']
  }
};

let PlayerSelectState = function(game) {
  this.backgroundImage
  this.dividingLine
  this.textarea
  this.enterName

  this.singlePlayer_text
  this.twoPlayer_text
  this.greeting_text

  this.singlePlayer_yes
  this.twoPlayer_yes

  this.introMusic

  // this.bubbleBuddy

}

PlayerSelectState.prototype = {

  preload: function() {
    game.load.image('background', 'public/assets/image/pongBoard2.png');

    game.load.bitmapFont('2P', 'public/assets/font/PressStart2P/2P.png', 'public/assets/font/PressStart2P/2P.xml');

    game.load.audio('Ternary', ['public/assets/sound/Com Truise - Ternary1.ogg', 'public/assets/sound/Com Truise - Ternary1.mp3']);

    game.add.plugin(PhaserInput.Plugin);


    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    // this.game.load.spritesheet('bubbleBuddy', 'public/assets/image/bubbs_animated_green_big.png', 96, 96, 36);

  },

  create: function() {

    this.createGraphics();

    if (!this.introMusic.isPlaying) {
      game.time.events.add(Phaser.Timer.SECOND * 2, this.playMusic, this);
    }

    this.enterName = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    this.selectName();

    // this.bubbleBuddy = this.game.add.sprite(395, 230, 'bubbleBuddy');
    // this.bubbleBuddy.animations.add('wobble', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 8, true);
    // this.bubbleBuddy.animations.play('wobble');
  },

  createGraphics: function() {
    this.introMusic = game.add.audio('Ternary', 1, true);

    this.backgroundImage = game.add.image(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
    this.dividingLine = this.createDividingLine(0, 0);

    this.greeting_text = game.add.bitmapText(10, 60, '2P', gameText.pong2k, 45);
    this.enterYourName_text = game.add.bitmapText(10, 160, '2P', gameText.enterYourName, 40);
    this.pressReturn_text = game.add.bitmapText(10, 360, '2P', gameText.pressReturn, 40);

    this.ballOptions_text = game.add.bitmapText(10, 220, '2P', gameText.ballOptions, 45);
    this.ballKeyCommands_text = game.add.bitmapText(properties.screenWidth - 150, 220, '2P', gameText.ballKeyCommands, 45);

    this.singlePlayer_text = game.add.bitmapText(10, 220, '2P', gameText.oneP, 45);
    this.twoPlayer_text = game.add.bitmapText(10, 380, '2P', gameText.twoP, 45);

    this.textfield = game.add.inputField(5, 245, {
      font: '40px Press Start 2P',
      fill: '#777777',
      fontWeight: 'bold',
      // fillAlpha: 0,
      fill: '#fefefe',
      width: 360,
      height: 45,
      padding: 10,
      borderWidth: 4,
      borderColor: '#fefefe',
      placeHolderColor: '#fefefe',
      cursorColor: '#fefefe',
      max: 11,
      backgroundColor: '#92cbd1'
    });
    this.textfield.blockInput = false;
  },

  createDividingLine: function(x, y) {
    let dividingLine = game.add.graphics(x, y);
    dividingLine.lineStyle(5, 0x848484, 1);

    for (let i = 0; i < properties.screenHeight; i += properties.dashSize * 2) {
      dividingLine.moveTo(game.world.centerX, i);
      dividingLine.lineTo(game.world.centerX, i + properties.dashSize);
    }
  },

  update: function() {
    if (this.enterName.isDown) {
      if (this.textfield.text._text <= 0) {
        properties.playerName = "Anonymous"
      } else {
        properties.playerName = this.textfield.text._text;
      }
      this.playerSelect();
    }

    if (this.pixelBall_yes && this.pixelBall_yes.isDown) {
      this.game.state.states['main']._ballChoice = "pixel";
      this.game.state.start('main');
    } else if (this.dogeBall_yes && this.dogeBall_yes.isDown) {
      this.game.state.states['main']._ballChoice = "doge";
      this.game.state.start('main');
    } else if (this.jasonBall_yes && this.jasonBall_yes.isDown && properties.playerName != '') {
      this.game.state.states['main']._ballChoice = "jason";
      this.game.state.start('main');
    }

    if (this.singlePlayer_yes && this.singlePlayer_yes.isDown) {
      this.introMusic.stop();
      this.game.state.states['main']._playerNumber = 1;
      properties.playerNumber = this.game.state.states['main']._playerNumber;
      this.selectBall();
    } else if (this.singlePlayer_yes && this.twoPlayer_yes.isDown) {
      socket.emit('gameStart', properties.playerName);
      this.introMusic.stop();
      this.game.state.states['main']._playerNumber = 2;
      properties.playerNumber = this.game.state.states['main']._playerNumber;
      this.game.state.start('main');
    }
  },

  playMusic: function () {
    this.introMusic.play()
  },

  selectName: function() {
    this.singlePlayer_text.visible = false;
    this.twoPlayer_text.visible = false;
    this.ballOptions_text.visible = false;
    this.ballKeyCommands_text.visible = false;
  },

  playerSelect: function() {
    this.singlePlayer_yes = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.twoPlayer_yes = game.input.keyboard.addKey(Phaser.Keyboard.TWO);

    this.singlePlayer_text.visible = true;
    this.twoPlayer_text.visible = true;
    this.textfield.visible = false;
    this.enterYourName_text.visible = false;
    this.pressReturn_text.visible = false;
    this.ballOptions_text.visible = false;
    this.ballKeyCommands_text.visible = false;
    // this.bubbleBuddy.visible = false;

    this.enterName.enabled = false;
  },

  selectBall: function() {
    this.pixelBall_yes = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.dogeBall_yes = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.jasonBall_yes = game.input.keyboard.addKey(Phaser.Keyboard.J);

    this.textfield.visible = false;
    this.enterYourName_text.visible = false;
    this.pressReturn_text.visible = false;
    this.ballOptions_text.visible = true;
    this.ballKeyCommands_text.visible = true;
    // this.bubbleBuddy.visible = false;
    this.singlePlayer_text.visible = false;
    this.twoPlayer_text.visible = false;

    this.enterName.enabled = false;
  },
}
