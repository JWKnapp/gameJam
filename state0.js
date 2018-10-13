let demo = {},
  centerX = 2000 / 2,
  centerY = 1500 / 2,
  ship,
  speed = 400,
  weapon,
  spawnAllowed = true,
  asteroidGroup,
  asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,
  },
  mainAsteroid = {
    minVelocity: 50,
    maxVelocity: 150,
    minAngularVelocity: 0,
    maxAngularVelocity: 200,
    score: 10,
  },
  asteroidCount = asteroidProperties.startingAsteroids;

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
    game.load.image('asteroid', 'assets/sprites/asteroid.png');
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
    asteroidGroup = this.game.add.group();
    asteroidGroup.enableBody = true;
    asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.resetAsteroids();
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
    // game.world.wrap(asteroidGroup, 0, true);
    // asteroidGroup.x = Math.floor(Math.random() * 10);
    // asteroidGroup.y = Math.floor(Math.random() * 10);
    asteroidGroup.forEachExists(this.checkBoundaries, this);
  },

  checkBoundaries: function(sprite) {
    if (sprite.x < 0) {
      sprite.x = game.width;
    } else if (sprite.x > game.width) {
      sprite.x = 0;
    }
    if (sprite.y < 0) {
      sprite.y = game.height;
    } else if (sprite.y > game.height) {
      sprite.y = 0;
    }
  },

  createAsteroid: function(x, y, size) {
    let asteroid = asteroidGroup.create(x, y, 'asteroid');
    asteroid.anchor.set(0.5, 0.5);
    asteroid.body.angularVelocity = game.rnd.integerInRange(
      size.minAngularVelocity,
      size.maxAngularVelocity
    );
    let randomAngle = game.math.degToRad(game.rnd.angle());
    let randomVelocity = game.rnd.integerInRange(
      size.minVelocity,
      size.maxVelocity
    );

    game.physics.arcade.velocityFromRotation(
      randomAngle,
      randomVelocity,
      asteroid.body.velocity
    );
    console.log('asteroid created');
  },

  resetAsteroids: function() {
    for (let i = 0; i < asteroidCount; i++) {
      let side = Math.round(Math.random());
      let x;
      let y;

      if (side) {
        x = Math.round(Math.random());
        y = Math.round(Math.random() * 2000);
      } else {
        x = Math.round(Math.random() * 2000);
        y = Math.round(Math.random() * 1500);
      }
      console.log('inside reset asteroid', mainAsteroid);
      this.createAsteroid(x, y, mainAsteroid);
    }
  },
};
