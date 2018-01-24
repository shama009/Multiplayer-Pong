// =============================================================================
// Match Record Select Game State
// =============================================================================

let MatchRecordSelectState = function(game) {
  this.backgroundImage
  this.dividingLine

  this.introMusic

  this.matchWinner
  this.matchHistory

  this.matchWinnerName_text
  this.ratio_text
  this.nameRatioLeft_text
  this.nameRatioRight_text
  this.newGameInstructions_text

  this.startNewGame
}

MatchRecordSelectState.prototype = {

  preload: function() {
    game.load.image('background', 'public/assets/image/pongBoard2.png');

    game.load.bitmapFont('2P', 'public/assets/font/PressStart2P/2P.png', 'public/assets/font/PressStart2P/2P.xml');

    game.load.bitmapFont('2P_shadow', 'public/assets/font/PressStart2P/2P_shadow.png', 'public/assets/font/PressStart2P/2P_shadow.xml');

    game.load.audio('Ternary',
      ['public/assets/sound/Com Truise - Ternary1.ogg', 'public/assets/sound/Com Truise - Ternary1.mp3']);
  },

  create: function() {
    this.createGraphics();

    if (!this.introMusic.isPlaying) {
      this.introMusic.play();
    }

    this.startNewGame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  },

  createGraphics: function() {
    this.introMusic = game.add.audio('Ternary', 1, true);

    this.backgroundImage = game.add.image(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
    this.dividingLine = this.createDividingLine(0, 0);

    this.matchWinner = game.add.bitmapText(game.world.centerX, properties.screenHeight - (properties.screenHeight / 7 * 6), '2P', gameText.matchWinner, 30);
    this.matchWinner.anchor.x = 0.5;
    this.matchWinner.align = 'center';

    this.matchWinnerName_text = game.add.bitmapText(game.world.centerX, properties.screenHeight - (properties.screenHeight / 7 * 5), '2P_shadow', properties.matchWinnerName, 40);
    this.matchWinnerName_text.anchor.x = 0.5;
    this.matchWinnerName_text.align = 'center';

    this.matchHistory = game.add.bitmapText(game.world.centerX, properties.screenHeight - (properties.screenHeight / 7 * 4),'2P', gameText.matchHistory, 30);
    this.matchHistory.anchor.x = 0.5;
    this.matchHistory.align = 'center';

    this.ratio_text = game.add.bitmapText(game.world.centerX, properties.screenHeight - (properties.screenHeight / 7 * 3),'2P', properties.ratio, 45);
    this.ratio_text.anchor.x = 0.5;
    this.ratio_text.align = 'center';

    this.nameRatioLeft_text = game.add.bitmapText(200, properties.screenHeight - (properties.screenHeight / 7 * 2),'2P', properties.nameRatioLeft, 30);
    this.nameRatioLeft_text.anchor.x = 0.5;
    this.nameRatioLeft_text.align = 'center';

    this.nameRatioRight_text = game.add.bitmapText(game.world.width - 200, properties.screenHeight - (properties.screenHeight / 7 * 2),'2P', properties.nameRatioRight, 30);
    this.nameRatioRight_text.anchor.x = 0.5;
    this.nameRatioRight_text.align = 'center';

    this.newGameInstructions_text = game.add.bitmapText(game.world.centerX, properties.screenHeight - (properties.screenHeight / 7 * 1), '2P', gameText.newGameInstructions, 30);
    this.newGameInstructions_text.anchor.x = 0.5;
    this.newGameInstructions_text.align = 'center';

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
    if (this.startNewGame.isDown) {
      this.introMusic.stop();
      this.game.state.start('playerSelect');
    }
  },

}
