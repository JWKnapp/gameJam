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
    asteroid: {
      minVelocity: 50,
      maxVelocity: 150,
      minAngularVelocity: 0,
      maxAngularVelocity: 200,
      score: 10,
      nextSize: 'medAsteroid',
      pieces: 2,
    },
    medAsteroid: {
      minVelocity: 50,
      maxVelocity: 200,
      minAngularVelocity: 0,
      maxAngularVelocity: 200,
      score: 50,
      nextSize: 'smallAsteroid',
      pieces: 3,
    },
    smallAsteroid: {
      minVelocity: 50,
      maxVelocity: 300,
      minAngularVelocity: 0,
      maxAngularVelocity: 200,
      score: 100,
    },
  },
  asteroidGroup,
  asteroidCount = asteroidProperties.startingAsteroids,
  startingLives = 3,
  timeToRespawn = 3,
  currentLives,
  fontStuff = {
    font: '100px Arial',
    fill: '#FFFFFF',
    align: 'center',
  },
  fuelCanisters,
  meters,
  fuel,
  fuelTimer,
  fuelLevel = 100;

// Particle emitters
let shipTrail, shipExplosion, asteroidExplosion;

// Sounds
let bgMusic, shipExplodeSound, splatSound;

demo.state0 = function() {};

demo.state0.createShipTrail = function() {
  shipTrail = game.add.emitter(ship.x, ship.y, 150);
  // game.world.sendToBack(shipTrail);
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
  shipTrail.start(false, 3000, 10);
};

demo.state0.createShipExplosion = function() {
  shipExplosion = game.add.emitter(ship.x, ship.y, 100);
  shipExplosion.makeParticles('playerParticle');
  shipExplosion.minParticleSpeed.setTo(-200, -200);
  shipExplosion.maxParticleSpeed.setTo(200, 200);
  shipExplosion.gravity = 0;

  shipExplosion.setScale(5, 10, 5, 10, 2000, Phaser.Easing.Quintic.Out);
  shipExplosion.setAlpha(1, 0, 3000);

  // Don't turn on the explosion unless meet certain conditions in the update()
};

demo.state0.createAsteroidExplosion = function() {
  asteroidExplosion = game.add.emitter(ship.x, ship.y, 300);
  asteroidExplosion.makeParticles('playerParticle');
  asteroidExplosion.minParticleSpeed.setTo(-200, -200);
  asteroidExplosion.maxParticleSpeed.setTo(200, 200);
  asteroidExplosion.gravity = 0;
  // Want explosion particles to bounce off stuff
  asteroidExplosion.bounce.setTo(1);

  asteroidExplosion.setScale(5, 10, 5, 10, 3000, Phaser.Easing.Quintic.Out);
  asteroidExplosion.setAlpha(1, 0, 3000);

  // Don't turn on the explosion unless meet certain conditions in the update()
};

demo.state0.updateShipTrail = function() {
  // Update the shipTrail to the ship's current position
  shipTrail.x = ship.x;
  shipTrail.y = ship.y;

  var velX = ship.body.velocity.x;
  var velY = ship.body.velocity.y;

  // Turn the shipTrail off if ship speed below a certain threshold
  const epsilon = 100;
  if (!ship.alive || (Math.abs(velX) < epsilon && Math.abs(velY) < epsilon)) {
    // console.log('ship not moving')
    shipTrail.on = false;
  } else {
    // console.log('ship moving', velX, velY)
    shipTrail.on = true;
  }

  velX *= -1;
  velY *= -1;

  shipTrail.minParticleSpeed.set(velX, velY);
  shipTrail.maxParticleSpeed.set(velX, velY);

  shipTrail.emitX = ship.x;
  shipTrail.emitY = ship.y;
};

demo.state0.updateShipExplosion = function() {
  shipExplosion.x = ship.x;
  shipExplosion.y = ship.y;
  // shipExplosion.gravity = 0;
};

demo.state0.updateAsteroidExplosion = function(asteroid) {
  // console.log('asteroid explosion', asteroid.x, asteroid.y)
  // const didCollide = game.physics.arcade.overlap(ship, asteroidGroup, change, this)
  // if (didCollide) {
  //   console.log('particle collided')
  // }
  asteroidExplosion.x = asteroid.x;
  asteroidExplosion.y = asteroid.y;
  asteroidExplosion.start(true, 3000, null, 50);
};

demo.state0.updateParticles = function() {
  demo.state0.updateShipTrail();
  demo.state0.updateShipExplosion();
};

// ================= PRELOAD, CREATE, UPDATE =====================

demo.state0.preload = function() {
  game.load.spritesheet('ship', 'assets/spriteSheets/shipSheet.png', 800, 500);
  game.load.image('bullet', 'assets/sprites/bullet.png');
  game.load.image('space', 'assets/backgrounds/space.png');
  game.load.image('asteroid', 'assets/sprites/eyeMonster.png');
  game.load.image('medAsteroid', 'assets/sprites/medMonster.png');
  game.load.image('smallAsteroid', 'assets/sprites/smallMonster.png');
  game.load.image('fuelCanister', 'assets/sprites/fuelCanister.png');
  // Load particle assets
  game.load.image('trailParticle', 'assets/particles/bullet.png');
  game.load.image('playerParticle', 'assets/particles/player-particle.png');

  // Load sounds
  // For Firefox can't use mp3
  game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
  game.load.audio('blastwave', 'assets/audio/blastwave.mp3');
  game.load.audio('splatSound', 'assets/audio/splat.mp3');
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
  weapon.enableBody = true;
  weapon.physicsBodyType = Phaser.Physics.ARCADE;
  fuelCanisters = game.add.group();
  fuelCanisters.enableBody = true;
  asteroidGroup = game.add.group();
  asteroidGroup.enableBody = true;
  asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
  game.physics.enable([asteroidGroup]);
  demo.state0.resetAsteroids();
  currentLives = game.add.text(30, 20, startingLives, fontStuff);

  demo.state0.createFuelBar();
  game.time.events.repeat(
    Phaser.Timer.SECOND * game.rnd.integerInRange(10, 30),
    50,
    demo.state0.createFuelCanister,
    this
  );

  // Particles

  demo.state0.createShipTrail();
  demo.state0.createShipExplosion();
  demo.state0.createAsteroidExplosion();

  // Set layering of images and particles
  // game.world.sendToBack(shipTrail);
  game.world.bringToTop(ship);

  // Sounds
  // key, volume = 1, loop? = false
  bgMusic = game.add.audio('bgMusic', 1, true);
  bgMusic.play();
  //timer

  fuelTimer = game.time.create(false);
  fuelTimer.loop(5000, demo.state0.updateFuelBar, this);
  fuelTimer.start();
  shipExplodeSound = game.add.audio('blastwave', 0.5);
  splatSound = game.add.audio('splatSound');
};

demo.state0.asteroidsCollided = function(ast1, ast2) {
  // console.log('asteroidsCollided()')
  // game.add.tween(speakers.scale).to( { x: 1.3, y: 1.1 }, 230, "Sine.easeInOut", true, 0, -1, true);
  // Phaser.Tween.to(properties, duration, ease, autoStart, delay, repeat, yoyo)
  game.add
    .tween(ast1.scale)
    .to({ x: 1.5, y: 1.5 }, 400, 'Sine.easeInOut', true, 0, 0, true);
  game.add
    .tween(ast2.scale)
    .to({ x: 1.5, y: 1.5 }, 400, 'Sine.easeInOut', true, 0, 0, true);
};

demo.state0.update = function() {
  const gameCxt = this;
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

  // Collisions
  game.physics.arcade.overlap(
    weapon.bullets,
    asteroidGroup,
    demo.state0.asteroidCollision,
    null,
    gameCxt
  );
  const collider = game.physics.arcade.overlap(
    ship,
    asteroidGroup,
    demo.state0.asteroidCollision,
    null,
    gameCxt
  );
  // if (collider) {
  //   console.log('collider collided')
  // }

  // asteroidExplosion.body.bounce.set(1)
  // const didCollide = game.physics.arcade.collide(asteroidExplosion, asteroidGroup, change, null, gameCxt)
  // if (didCollide) {
  //   console.log('particle collided')
  // }

  const astCollide = game.physics.arcade.collide(
    asteroidGroup,
    asteroidGroup,
    demo.state0.asteroidsCollided,
    null,
    gameCxt
  );
  // if (astCollide) {
  //   console.log('asteroids collided')
  // }
  game.physics.arcade.overlap(
    ship,
    fuelCanisters,
    demo.state0.canisterCollision,
    null,
    gameCxt
  );

  //check for game over

  demo.state0.gameOver();
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

demo.state0.createFuelCanister = function() {
  if (spawnAllowed) {
    let canister = fuelCanisters.create(
      game.world.randomX,
      game.world.randomY,
      'fuelCanister'
    );
    canister.anchor.set(0.5, 0.5);
    canister.scale.set(0.2, 0.2);
    canister.angle = game.math.degToRad(game.rnd.angle());
    console.log('canister created');
  }
};

// demo.state0.queueCanister = function(time) {
//   game.time.events.repeat(time, demo.state0.createFuelCanister('fuelCanister'), this)
// }

demo.state0.createAsteroid = function(x, y, size, pieces) {
  if (pieces === undefined) {
    pieces = 1;
  }
  console.log(asteroidProperties[size].pieces);
  for (let i = 0; i < pieces; i++) {
    console.log('in da loop');
    let asteroid = asteroidGroup.create(x, y, size);
    asteroid.anchor.set(0.5, 0.5);
    // Setting the asteroids to bounce off one another
    asteroid.body.bounce.setTo(1);
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
  }
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

    this.createAsteroid(x, y, 'asteroid');
  }
};

// If bullet or ship hits the collision
demo.state0.asteroidCollision = function(target, asteroid) {
  target.kill();

  // If ship hits the asteroid
  if (target.key === 'ship') {
    // Make ship explode sound
    shipExplodeSound.play();
    // Make ship explode particles
    shipExplosion.start(true, 1000, null, 50);

    // Decrement lives
    startingLives--;
    currentLives.text = startingLives;
    if (startingLives > 0) {
      game.time.events.add(
        Phaser.Timer.SECOND * timeToRespawn,
        demo.state0.resetShip,
        this
      );
    }
  }
  // Else the asteroid has been shot
  else {
    asteroid.kill();
    // Play sound
    splatSound.play();

    demo.state0.updateAsteroidExplosion(asteroid);
    demo.state0.splitAsteroid(asteroid);
  }
};

demo.state0.canisterCollision = function(target, canister) {
  if (target.key === 'ship') {
    canister.kill();
    fuelLevel = 100;
    demo.state0.updateFuelBar();
    Phaser.Keyboard.W.enabled = true;
  }
};

demo.state0.splitAsteroid = function(asteroid) {
  console.log('asteroid to split', asteroid);
  if (asteroidProperties[asteroid.key].nextSize) {
    demo.state0.createAsteroid(
      asteroid.x,
      asteroid.y,
      asteroidProperties[asteroid.key].nextSize,
      asteroidProperties[asteroid.key].pieces
    );
  }
};

demo.state0.resetShip = function() {
  ship.reset(centerX, centerY);
  ship.angle = 0;
};

demo.state0.createFuelBar = function() {
  meters = game.add.group();

  // create a plain black rectangle to use as the background of a health meter
  var meterBackgroundBitmap = game.add.bitmapData(20, 100);
  meterBackgroundBitmap.ctx.beginPath();
  meterBackgroundBitmap.ctx.rect(
    0,
    0,
    meterBackgroundBitmap.width,
    meterBackgroundBitmap.height
  );
  meterBackgroundBitmap.ctx.fillStyle = '#000000';
  meterBackgroundBitmap.ctx.fill();

  // create a Sprite using the background bitmap data
  var fuelMeterBG = game.add.sprite(10, 10, meterBackgroundBitmap);
  fuelMeterBG.fixedToCamera = true;
  meters.add(fuelMeterBG);

  // create a red rectangle to use as the fuel meter
  var fuelBitmap = game.add.bitmapData(12, 92);
  fuelBitmap.ctx.beginPath();
  fuelBitmap.ctx.rect(0, 0, fuelBitmap.width, fuelBitmap.height);
  fuelBitmap.ctx.fillStyle = '#FF0000';
  fuelBitmap.ctx.fill();

  // create the fuel Sprite using the red rectangle bitmap data
  fuel = game.add.sprite(14, 14, fuelBitmap);
  meters.add(fuel);
  fuel.fixedToCamera = true;
};

demo.state0.updateFuelBar = function() {
  console.log('fuel updated');
  var m = (100 - fuelLevel) / 100;
  var bh = 92 - 92 * m;
  var offset = 92 - bh;

  fuel.key.context.clearRect(0, 0, fuel.width, fuel.height);
  fuel.key.context.fillRect(0, offset, 12, bh);
  fuel.key.dirty = true;
  fuelLevel -= 5;
};

demo.state0.outOfFuel = function() {
  if (fuelLevel === 0) {
    console.log('out of fuel');
    Phaser.Keyboard.W.enabled = false;
  }
};
demo.state0.gameOver = function() {
  if (startingLives === 0) {
    game.state.start('stateOver');
  }
};

demo.state0.prototype = {
  preload: demo.state0.preload,
  create: demo.state0.create,
  update: demo.state0.update,
};
