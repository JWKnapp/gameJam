let demo = {},
  centerX = 2000 / 2,
  centerY = 1500 / 2,
  ship,
  speed = 400,
  weapon,
  spawnAllowed = true,
  asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,
    asteroid :{minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 10, nextSize:'medAsteroid', pieces:2},
    medAsteroid : {minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: 'smallAsteroid', pieces:3},
    smallAsteroid : {minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100}
  },
  asteroidGroup,
  asteroidCount = asteroidProperties.startingAsteroids,
  startingLives = 3,
  timeToRespawn = 3,
  currentLives,
  fontStuff = {
    font: '100px Arial', fill: '#FFFFFF', align: 'center'

  }

// Particles
let shipTrail;

demo.state0 = function() {};

demo.state0.createShipTrail = function() {
  shipTrail = game.add.emitter(ship.x, ship.y, 150);
  shipTrail.gravity = 0;
  shipTrail.width = 15;
  shipTrail.makeParticles('trailParticle');
  shipTrail.setXSpeed(30, -30);
  shipTrail.setYSpeed(200, 180);
  shipTrail.setRotation(0, 0);
  // setAlpha(min, max, rate, ease, yoyo)
  // The rate (in ms) parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
  // If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
  // shipTrail.setAlpha(1, 0.01, 1500, Phaser.Easing.Quintic.Out); //800
  // minX, maxX, minY, maxY, rate, ease, yoyo
  // shipTrail.setScale(0.5, 2, 0.5, 2, 3000, Phaser.Easing.Quintic.Out);

  shipTrail.setAlpha(1, 0, 3000);
  shipTrail.setScale(0.8, 0, 0.8, 0, 3000);

  // emitter.gravity = 200;
  // emitter.setAlpha(1, 0, 3000);
  // emitter.setScale(0.8, 0, 0.8, 0, 3000);
  // emitter.start(false, 3000, 5);

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

  var velX = ship.body.velocity.x;
  var velY = ship.body.velocity.y;

  // Turn the shipTrail off if ship speed below a certain threshold
  const epsilon = 100
  if (Math.abs(velX) < epsilon && Math.abs(velY) < epsilon) {
    // console.log('ship not moving')
    shipTrail.on = false
  } else {
    // console.log('ship moving', velX, velY)
    shipTrail.on = true
  }

  velX *= -1;
  velY *= -1;

  shipTrail.minParticleSpeed.set(velX, velY);
  shipTrail.maxParticleSpeed.set(velX, velY);

  shipTrail.emitX = ship.x;
  shipTrail.emitY = ship.y;
};

// ================= PRELOAD, CREATE, UPDATE =====================

demo.state0.preload = function() {
  game.load.spritesheet('ship', 'assets/spriteSheets/shipSheet.png', 800, 500);
  game.load.image('bullet', 'assets/sprites/bullet.png');
  game.load.image('space', 'assets/backgrounds/space.png');
  game.load.image('asteroid', 'assets/sprites/asteroid.png');
  game.load.image('medAsteroid', 'assets/sprites/medAsteroid.png')
  game.load.image('smallAsteroid', 'assets/sprites/smallAsteroid.png')
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
  currentLives = game.add.text(30, 20, startingLives, fontStuff)
  console.log('current lives', startingLives)
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

demo.state0.createAsteroid = function(x, y, size, pieces) {
  if(pieces === undefined){pieces = 1}
  console.log(asteroidProperties[size].pieces)
  for(let i = 0; i < pieces; i++){
    console.log('in da loop')
    let asteroid = asteroidGroup.create(x, y, size);
   asteroid.anchor.set(0.5, 0.5);
   asteroid.body.angularVelocity = game.rnd.integerInRange(
    asteroidProperties[size].minAngularVelocity,
    asteroidProperties[size].maxAngularVelocity
   );
   let randomAngle = game.math.degToRad(game.rnd.angle());
   let randomVelocity = game.rnd.integerInRange(
     asteroidProperties[size].minVelocity,
     asteroidProperties[size].maxVelocity
   );

  game.physics.arcade.velocityFromRotation(
    randomAngle,
    randomVelocity,
    asteroid.body.velocity
  );
  console.log('asteroid created');
  };
}

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

    this.createAsteroid(x, y, 'asteroid');
  }
};

demo.state0.asteroidCollision = function(target, asteroid) {
  target.kill()
  asteroid.kill()

  if(target.key == 'ship') {
    startingLives --
    currentLives.text = startingLives
    if(startingLives > 0) {
      game.time.events.add(Phaser.Timer.SECOND * timeToRespawn, demo.state0.resetShip, this)
    }
  }
  demo.state0.splitAsteroid(asteroid)

},

demo.state0.splitAsteroid = function(asteroid) {
  console.log('asteroid to split', asteroid)
if(asteroidProperties[asteroid.key].nextSize) {
  demo.state0.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces)
}
}

demo.state0.resetShip = function() {
  ship.reset(centerX, centerY)
  ship.angle = 0
}

demo.state0.prototype = {
  preload: demo.state0.preload,
  create: demo.state0.create,
  update: demo.state0.update,
};
