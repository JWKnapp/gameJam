

let game = new Phaser.Game(3000, 1500, Phaser.AUTO)

let demo = {},
bgMusic

demo.stateStartScreen = function() {};

demo.stateStartScreen.prototype = {
    preload: function () {
        game.load.image('startScreen', 'assets/backgrounds/monsteroids-cover.png')
        game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
    },
  create: function () {
    // music on the title screen
    bgMusic = game.add.audio('bgMusic', 1, true);
  bgMusic.play();

    //game title
    let title = game.add.sprite(game.world.centerX, game.world.centerY, 'startScreen')
    title.anchor.set(0.5)
    title.scale.set(4)

    //game over text
      let startGame = game.add.text(game.world.centerX, game.world.centerY + 200, 'START GAME', {font: 'Arial', fill: '#F2F2F2'});
      startGame.anchor.set(0.5);
      startGame.fontWeight = 'bold'
      startGame.align = 'center'
      startGame.fontSize = 70

      //game over relfection
      let startGameReflect = game.add.text(game.world.centerX, game.world.centerY + 250, "START GAME")
      startGameReflect.anchor.set(0.5);
      startGameReflect.align = 'center';
      startGameReflect.scale.y = -1;
      startGameReflect.font = 'Arial';
      startGameReflect.fontWeight = 'bold';
      startGameReflect.fontSize = 70;

      let grd = startGameReflect.context.createLinearGradient(0, 0, 0, startGame.canvas.height);

    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');
    startGameReflect.fill = grd

    game.world.setBounds(0, 0, 3000, 1500);
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  },

  update: function () {
          game.input.onTap.addOnce(function () {
            bgMusic.destroy()
          game.state.start('state0');});

  }
};

export {game, demo}
