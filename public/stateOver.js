
import {game, demo} from './stateStartScreen'

demo.stateOver = function() {};

demo.stateOver.prototype = {
    preload: function () {
        game.load.image('gameTitle', 'assets/sprites/monsteroids-title.png')
    },
  create: function () {

    //game title
    let title = game.add.sprite(game.world.centerX, game.world.centerY - 400, 'gameTitle')
    title.anchor.set(0.5)

    //game over text
      let gameoverLabel = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER', {font: 'Arial', fill: '#F2F2F2'});
      gameoverLabel.anchor.set(0.5);
      gameoverLabel.fontWeight = 'bold'
      gameoverLabel.align = 'center'
      gameoverLabel.fontSize = 70

      //game over relfection
      let gameOverReflect = game.add.text(game.world.centerX, game.world.centerY + 50, "GAME OVER")
      gameOverReflect.anchor.set(0.5);
      gameOverReflect.align = 'center';
      gameOverReflect.scale.y = -1;
      gameOverReflect.font = 'Arial';
      gameOverReflect.fontWeight = 'bold';
      gameOverReflect.fontSize = 70;

      let grd = gameOverReflect.context.createLinearGradient(0, 0, 0, gameoverLabel.canvas.height);

    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');
    gameOverReflect.fill = grd

    //restart text
    let restartText = game.add.text(game.world.centerX, game.world.centerY + 250, 'Click to restart', {font: 'Arial', fill: '#F2F2F2'})
    restartText.anchor.set(0.5);
      restartText.fontWeight = 'bold'
      restartText.align = 'center'
      restartText.fontSize = 70

      // restart reflection
    let restartReflect = game.add.text(game.world.centerX, game.world.centerY + 300, "Click to restart")
    restartReflect.anchor.set(0.5);
    restartReflect.align = 'center';
    restartReflect.scale.y = -1;
    restartReflect.font = 'Arial';
    restartReflect.fontWeight = 'bold';
    restartReflect.fontSize = 70;

    let grd2 = restartReflect.context.createLinearGradient(0, 0, 0, restartText.canvas.height);

  grd2.addColorStop(0, 'rgba(255,255,255,0)');
  grd2.addColorStop(1, 'rgba(255,255,255,0.08)');
  restartReflect.fill = grd2

  },

  update: function () {

       //reset game lives
            // demo.startingLives = 3
          //the "click to restart" handler
          game.input.onTap.addOnce(function () {
              // demo.bgMusic.destroy()
          game.state.start('state0');});

  }
};

export default demo.stateOver


