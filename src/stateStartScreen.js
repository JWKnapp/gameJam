import Phaser from 'phaser';

class StartScreen {
  constructor(game) {
    this.game = game;
    this.bgMusic = null;
  }

  preload() {
    this.game.load.image('startScreen', 'assets/backgrounds/monsteroids-cover.png');
    this.game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
  }

  create() {
    // music on the title screen
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
    this.bgMusic.play();

    //game title
    let title = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'startScreen'
    );
    title.anchor.set(0.5);
    title.scale.set(4);

    //game start text
    let startGame = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 200,
      'START GAME',
      { font: 'Arial', fill: '#F2F2F2' }
    );
    startGame.anchor.set(0.5);
    startGame.fontWeight = 'bold';
    startGame.align = 'center';
    startGame.fontSize = 70;

    //game start relfection
    let startGameReflect = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 250,
      'START GAME'
    );
    startGameReflect.anchor.set(0.5);
    startGameReflect.align = 'center';
    startGameReflect.scale.y = -1;
    startGameReflect.font = 'Arial';
    startGameReflect.fontWeight = 'bold';
    startGameReflect.fontSize = 70;

    let grd = startGameReflect.context.createLinearGradient(
      0,
      0,
      0,
      startGame.canvas.height
    );

    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');
    startGameReflect.fill = grd;

    //credits
    let credits = this.game.add.text(
      this.game.world.centerX + 600,
      this.game.world.centerY + 600,
      'By: Jehoshuah Knapp & Brandon Yee',
      { font: 'Arial', fill: '#F2F2F2' }
    );
    credits.anchor.set(0.5);
    credits.align = 'center';
    credits.fontSize = 60;

    this.game.world.setBounds(0, 0, 3000, 1500);
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }

  update() {
    const bgMusic = this.bgMusic
    const game = this.game
    this.game.input.onTap.addOnce(function() {
      bgMusic.destroy();
      game.state.start('mainGame');
    });
  }
}

export default StartScreen;
