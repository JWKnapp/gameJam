import Phaser from 'phaser';

// const game = new Phaser.Game(3000, 1500, Phaser.AUTO);

// let bgMusic;

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

    //game over text
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

    //game over relfection
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

    this.game.world.setBounds(0, 0, 3000, 1500);
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }

  update() {
    this.game.input.onTap.addOnce(function() {
      this.bgMusic.destroy();
      this.game.state.start('state0');
    });
  }
}

// demo.stateStartScreen = function() {};

// demo.stateStartScreen.prototype = {
//   preload: function() {
//     game.load.image('startScreen', 'assets/backgrounds/monsteroids-cover.png');
//     game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
//   },
//   create: function() {
//     // music on the title screen
//     bgMusic = game.add.audio('bgMusic', 1, true);
//     bgMusic.play();

//     //game title
//     let title = game.add.sprite(
//       game.world.centerX,
//       game.world.centerY,
//       'startScreen'
//     );
//     title.anchor.set(0.5);
//     title.scale.set(4);

//     //game over text
//     let startGame = game.add.text(
//       game.world.centerX,
//       game.world.centerY + 200,
//       'START GAME',
//       { font: 'Arial', fill: '#F2F2F2' }
//     );
//     startGame.anchor.set(0.5);
//     startGame.fontWeight = 'bold';
//     startGame.align = 'center';
//     startGame.fontSize = 70;

//     //game over relfection
//     let startGameReflect = game.add.text(
//       game.world.centerX,
//       game.world.centerY + 250,
//       'START GAME'
//     );
//     startGameReflect.anchor.set(0.5);
//     startGameReflect.align = 'center';
//     startGameReflect.scale.y = -1;
//     startGameReflect.font = 'Arial';
//     startGameReflect.fontWeight = 'bold';
//     startGameReflect.fontSize = 70;

//     let grd = startGameReflect.context.createLinearGradient(
//       0,
//       0,
//       0,
//       startGame.canvas.height
//     );

//     grd.addColorStop(0, 'rgba(255,255,255,0)');
//     grd.addColorStop(1, 'rgba(255,255,255,0.08)');
//     startGameReflect.fill = grd;

//     game.world.setBounds(0, 0, 3000, 1500);
//     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//   },

//   update: function() {
//     game.input.onTap.addOnce(function() {
//       bgMusic.destroy();
//       game.state.start('state0');
//     });
//   },
// };

// const startScreen = new StartScreen(game);

export { StartScreen };
