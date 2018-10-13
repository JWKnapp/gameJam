let demo = {},
  centerX = 2000 / 2,
  centerY = 1500 / 2,
  ship,
  speed = 400,
  weapon;

demo.state0 = function() {};
demo.state0.prototype = {
  preload: function() {
    game.load.spritesheet(
      'ship',
      'assets/spriteSheets/shipSheet.png',
      800,
      500
    );
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('space', 'assets/backgrounds/space.png');
  },
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, 1500);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    let spaceBG = game.add.sprite(0, 0, 'space');
    ship = game.add.sprite(centerX, centerY, 'ship');
    ship.anchor.setTo(0.5, 0.5);
    ship.scale.setTo(0.1, 0.1);
    game.physics.enable(ship);
    ship.body.drag.set(70);
    ship.animations.add('boost', [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
    ]);
    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = speed;
    weapon.fireRate = 1000;
    weapon.trackSprite(ship, 20, 20, true);
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      ship.body.angularVelocity = speed;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      ship.body.angularVelocity = -speed;
    } else {
      ship.body.angularVelocity = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      game.physics.arcade.accelerationFromRotation(
        ship.rotation,
        300,
        ship.body.acceleration
      );
      ship.animations.play('boost', 10, true);
    } else {
      ship.animations.stop('boost');
      ship.frame = 0;
      ship.body.acceleration.set(0);
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      weapon.fire();
    }
    game.world.wrap(ship, 0, true);
  },
};
