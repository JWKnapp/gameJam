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

// Particles
let shipTrail;

demo.state0 = function() {};

demo.state0.createShipTrail = function() {
  shipTrail = game.add.emitter(ship.x, ship.y, 150);
  shipTrail.width = 75;
  shipTrail.makeParticles('trailParticle');
  shipTrail.setXSpeed(30, -30);
  shipTrail.setYSpeed(200, 180);
  shipTrail.setRotation(0, 0);
  shipTrail.gravity = 50;
  // setAlpha(min, max, rate, ease, yoyo)
  // The rate (in ms) parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
  // If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
  shipTrail.setAlpha(1, 0.01, 1500, Phaser.Easing.Quintic.Out); //800
  // minX, maxX, minY, maxY, rate, ease, yoyo
  // shipTrail.setScale(0.5, 2, 0.5, 2, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.setScale(0.5, 2, 0.5, 2, 3000, Phaser.Easing.Quintic.Out);
  // true (single particle emission [single explosion]),
  // 1000 (last 1 sec),
  // null (for repeating emissions [how many per emission])
  // 100 particles on this single explosion
  shipTrail.start(false, 2000, 10);
};

demo.state0.updateParticles = function() {
  // Update the shipTrail to the ship's current position
  shipTrail.x = ship.x;
  shipTrail.y = ship.y;
};

// ================= PRELOAD, CREATE, UPDATE =====================

demo.state0.preload = function() {
  game.load.spritesheet('ship', 'assets/spriteSheets/shipSheet.png', 800, 500);
  game.load.image('bullet', 'assets/sprites/bullet.png');
  game.load.image('space', 'assets/backgrounds/space.png');
  game.load.image('asteroid', 'assets/sprites/asteroid.png');

  // Load particle assets
  game.load.image('trailParticle', '/assets/particles/bullet.png');
  game.load.image('playerParticle', '/assets/particles/player-particle.png');
};

demo.state0.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 2000, 1500);
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  let spaceBG = game.add.sprite(0, 0, 'space');
  ship = game.add.sprite(centerX, centerY, 'ship');
  ship.anchor.setTo(0.5, 0.5);
  ship.scale.setTo(0.1, 0.1);
  game.physics.enable(ship);
  ship.body.drag.set(70);
  ship.animations.add('boost', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  weapon = game.add.weapon(30, 'bullet');
  // weapon.scale.setTo(10, 10);
  weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  weapon.bulletSpeed = speed;
  weapon.fireRate = 1000;
  weapon.trackSprite(ship, 20, 20, true);
  weapon.enableBody = true
  weapon.physicsBodyType = Phaser.Physics.ARCADE;

  asteroidGroup = this.game.add.group();
  asteroidGroup.enableBody = true;
  asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
  demo.state0.resetAsteroids();

  // Particles
  demo.state0.createShipTrail();
};

demo.state0.update = function() {
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
  asteroidGroup.forEachExists(demo.state0.checkBoundaries);

  // Update particles
  demo.state0.updateParticles();

  game.physics.arcade.overlap(weapon.bullets, asteroidGroup, demo.state0.asteroidCollision, null, this)
  game.physics.arcade.overlap(ship, asteroidGroup, demo.state0.asteroidCollision, null, this)
};

demo.state0.checkBoundaries = function(sprite) {
  if (sprite.x < 0) {
    sprite.x = game.width;
    console.log('moving sprite', game.width);
  } else if (sprite.x > game.width) {
    sprite.x = 0;
    console.log('moving sprite', game.width);
  }
  if (sprite.y < 0) {
    sprite.y = game.height;
  } else if (sprite.y > game.height) {
    sprite.y = 0;
  }
};

demo.state0.createAsteroid = function(x, y, size) {
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
};

demo.state0.resetAsteroids = function() {
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
};

demo.state0.asteroidCollision = function(target, asteroid) {
  target.kill()
  asteroid.kill()
}

demo.state0.prototype = {
  preload: demo.state0.preload,
  create: demo.state0.create,
  update: demo.state0.update,
};
