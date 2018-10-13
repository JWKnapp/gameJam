let demo = {},
  centerX = 2000 / 2,
  centerY = 1500 / 2,
  ship,
  speed = 6;

demo.state0 = function() {};
demo.state0.prototype = {
  preload: function() {
    game.load.image('ship', 'assets/sprites/ship.png', 500, 500);
    game.load.image('space', 'assets/backgrounds/space.png');
  },
  create: function() {
    game.world.setBounds(0, 0, 3000, 3000);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    let spaceBG = game.add.sprite(0, 0, 'space');
    ship = game.add.sprite(centerX, centerY, 'ship');
    ship.anchor.setTo(0.5, 0.5);
    ship.scale.setTo(0.2, 0.2);
  },
  update: function() {},
};
