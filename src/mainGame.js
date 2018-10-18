// import {game, demo} from './stateStartScreen'
import Phaser from 'phaser';

// let game = new Phaser.Game(3000, 1500, Phaser.AUTO);
// let demo = {},

class MainGame {
  constructor(game) {
    this.game = game;
    this.bgMusic = null;
    this.centerX = 3000 / 2;
    this.centerY = 1500 / 2;
    this.speed = 300;
    this.spawnAllowed = true;
    this.asteroidProperties = {
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
    };
    this.startingLives = 3;
    this.timeToRespawn = 3;
    this.asteroidCount = this.asteroidProperties.startingAsteroids;
    this.fontStuff = {
      font: '100px Arial',
      fill: '#FFFFFF',
      align: 'center',
    };
    this.fuelLevel = 100;
    this.starCount = 20;
    this.ship = null;
    this.asteroidGroup = null;
    this.currentLives = null;
    this.fuelCanisters = null;
    this.meters = null;
    this.fuel = null;
    this.fuelTimer = null;
    this.starGroup = null;
    this.asteroid = null;
    this.weapon = null;
    this.shipTrail = null;
    this.shipExplosion = null;
    this.asteroidExplosion = null;
    this.bgMusic = null;
    this.shipExplodeSound = null;
    this.splatSound = null;
  }

  preload() {
    this.game.load.spritesheet(
      'ship',
      'assets/spriteSheets/shipSheet.png',
      800,
      500
    );
    this.game.load.image('bullet', 'assets/sprites/bullet.png');
    this.game.load.spritesheet(
      'asteroid',
      'assets/spriteSheets/eyeMonsterSheet.png',
      320,
      320
    );
    this.game.load.image('medAsteroid', 'assets/sprites/medMonster.png');
    this.game.load.image('smallAsteroid', 'assets/sprites/smallMonster.png');
    this.game.load.image('fuelCanister', 'assets/sprites/fuelCanister.png');
    this.game.load.image('star', 'assets/sprites/bullet.png');
    // Load particle assets
    this.game.load.image('trailParticle', 'assets/particles/bullet.png');
    this.game.load.image(
      'playerParticle',
      'assets/particles/player-particle.png'
    );
    // Load sounds
    // For Firefox can't use mp3
    this.game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
    this.game.load.audio('blastwave', 'assets/audio/blastwave.mp3');
    this.game.load.audio('splatSound', 'assets/audio/splat.mp3');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.world.setBounds(0, 0, 3000, 1500);
    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // let spaceBG = game.add.sprite(0, 0, 'space');

    //create random stars
    this.starGroup = this.game.add.group();
    this.starGroup.enableBody = true;
    this.createStars();
    //create ship
    this.ship = this.game.add.sprite(this.centerX, this.centerY, 'ship');
    this.ship.anchor.setTo(0.5, 0.5);
    this.ship.scale.setTo(0.1, 0.1);
    this.game.physics.enable(this.ship);
    this.ship.body.drag.set(70);
    this.ship.animations.add('boost', [
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
    //ship gun
    this.weapon = this.game.add.weapon(30, 'bullet');
    // weapon.scale.setTo(10, 10);
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = this.speed;
    this.weapon.fireRate = 1000;
    this.weapon.trackSprite(this.ship, 20, 20, true);
    this.weapon.enableBody = true;
    this.weapon.physicsBodyType = Phaser.Physics.ARCADE;
    //random fuel cells
    this.fuelCanisters = this.game.add.group();
    this.fuelCanisters.enableBody = true;
    this.game.time.events.repeat(
      Phaser.Timer.SECOND * this.game.rnd.integerInRange(10, 30),
      50,
      this.createFuelCanister,
      this
    );
    //asteroid group
    this.asteroidGroup = this.game.add.group();
    this.asteroidGroup.enableBody = true;
    this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.game.physics.enable([this.asteroidGroup]);
    this.resetAsteroids();
    this.game.time.events.repeat(
      Phaser.Timer.SECOND * this.game.rnd.integerInRange(2, 10),
      500,
      this.blinkTimer,
      this
    );
    //life and fuel counters
    this.currentLives = this.game.add.text(
      30,
      20,
      this.startingLives,
      this.fontStuff
    );
    this.createFuelBar();
    //timer
    this.fuelTimer = this.game.time.create(false);
    this.fuelTimer.loop(5000, this.updateFuelBar, this);
    this.fuelTimer.start();
    // Particles
    this.createShipTrail();
    this.createShipExplosion();
    this.createAsteroidExplosion();
    // Set layering of images and particles
    // game.world.sendToBack(shipTrail);
    this.game.world.bringToTop(this.ship);
    // Sounds
    // key, volume = 1, loop? = false
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
    this.bgMusic.play();
    this.shipExplodeSound = this.game.add.audio('blastwave', 0.5);
    this.splatSound = this.game.add.audio('splatSound');
  }

  update() {
    const gameCxt = this;
    const game = this.game;
    //ship controller
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      this.ship.body.angularVelocity = this.speed;
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.ship.body.angularVelocity = -this.speed;
    } else {
      this.ship.body.angularVelocity = 0;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      this.game.physics.arcade.accelerationFromRotation(
        this.ship.rotation,
        this.speed,
        this.ship.body.acceleration
      );
      this.ship.animations.play('boost', 10, true);
    } else {
      this.ship.animations.stop('boost');
      this.ship.frame = 0;
      this.ship.body.acceleration.set(0);
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.weapon.fire();
    }
    this.game.world.wrap(this.ship, 0, true);
    this.asteroidGroup.forEachExists(this.checkBoundaries);
    // Update particles
    this.updateParticles();
    // Collisions
    this.game.physics.arcade.overlap(
      this.weapon.bullets,
      this.asteroidGroup,
      this.asteroidCollision,
      null,
      gameCxt
    );
    const collider = this.game.physics.arcade.overlap(
      this.ship,
      this.asteroidGroup,
      this.asteroidCollision,
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
    //********************************************************************** */
    // const astCollide = this.game.physics.arcade.collide(
    //   this.asteroidGroup,
    //   this.asteroidGroup,
    //   this.asteroidsCollided,
    //   null,
    //   gameCxt
    // );
    // if (astCollide) {
    //   console.log('asteroids collided')
    // }
    this.game.physics.arcade.overlap(
      this.ship,
      this.fuelCanisters,
      this.canisterCollision,
      null,
      gameCxt
    );
    // check for out of fuel
    this.outOfFuel();
    //check for this.game over
    this.gameOver();
  }

  createShipTrail() {
    this.shipTrail = this.game.add.emitter(this.ship.x, this.ship.y, 150);
    // game.world.sendToBack(this.shipTrail);
    this.shipTrail.gravity = 0;
    this.shipTrail.width = 15;
    this.shipTrail.makeParticles('trailParticle');
    this.shipTrail.setXSpeed(30, -30);
    this.shipTrail.setYSpeed(200, 180);
    this.shipTrail.setRotation(0, 0);
    // setAlpha(min, max, rate, ease, yoyo)
    // The rate (in ms) parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
    // If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
    // shipTrail.setAlpha(1, 0.01, 1500, Phaser.Easing.Quintic.Out); //800
    // minX, maxX, minY, maxY, rate, ease, yoyo
    // shipTrail.setScale(0.5, 2, 0.5, 2, 3000, Phaser.Easing.Quintic.Out);

    this.shipTrail.setAlpha(1, 0, 3000);
    this.shipTrail.setScale(0.8, 0, 0.8, 0, 3000);

    // emitter.gravity = 200;
    // emitter.setAlpha(1, 0, 3000);
    // emitter.setScale(0.8, 0, 0.8, 0, 3000);
    // emitter.start(false, 3000, 5);

    // true (single particle emission [single explosion]),
    // 1000 (last 1 sec),
    // null (for repeating emissions [how many per emission])
    // 100 particles on this single explosion
    this.shipTrail.start(false, 3000, 10);
  }

  createShipExplosion() {
    this.shipExplosion = this.game.add.emitter(this.ship.x, this.ship.y, 100);
    this.shipExplosion.makeParticles('playerParticle');
    this.shipExplosion.minParticleSpeed.setTo(-200, -200);
    this.shipExplosion.maxParticleSpeed.setTo(200, 200);
    this.shipExplosion.gravity = 0;

    this.shipExplosion.setScale(5, 10, 5, 10, 2000, Phaser.Easing.Quintic.Out);
    this.shipExplosion.setAlpha(1, 0, 3000);

    // Don't turn on the explosion unless meet certain conditions in the update()
  }

  createAsteroidExplosion() {
    this.asteroidExplosion = this.game.add.emitter(
      this.ship.x,
      this.ship.y,
      300
    );
    this.asteroidExplosion.makeParticles('playerParticle');
    this.asteroidExplosion.minParticleSpeed.setTo(-200, -200);
    this.asteroidExplosion.maxParticleSpeed.setTo(200, 200);
    this.asteroidExplosion.gravity = 0;
    // Want explosion particles to bounce off stuff
    this.asteroidExplosion.bounce.setTo(1);

    this.asteroidExplosion.setScale(
      5,
      10,
      5,
      10,
      3000,
      Phaser.Easing.Quintic.Out
    );
    this.asteroidExplosion.setAlpha(1, 0, 3000);
    // Don't turn on the explosion unless meet certain conditions in the update()
  }

  updateShipTrail = () => {
    // Update the shipTrail to the ship's current position
    this.shipTrail.x = this.ship.x;
    this.shipTrail.y = this.ship.y;
    let velX = this.ship.body.velocity.x;
    let velY = this.ship.body.velocity.y;
    // Turn the this.shipTrail off if this.ship speed below a certain threshold
    const epsilon = 100;
    if (
      !this.ship.alive ||
      (Math.abs(velX) < epsilon && Math.abs(velY) < epsilon)
    ) {
      // console.log('this.ship not moving')
      this.shipTrail.on = false;
    } else {
      // console.log('this.ship moving', velX, velY)
      this.shipTrail.on = true;
    }

    velX *= -1;
    velY *= -1;

    this.shipTrail.minParticleSpeed.set(velX, velY);
    this.shipTrail.maxParticleSpeed.set(velX, velY);

    this.shipTrail.emitX = this.ship.x;
    this.shipTrail.emitY = this.ship.y;
  }

  updateShipExplosion = () => {
    this.shipExplosion.x = this.ship.x;
    this.shipExplosion.y = this.ship.y;
    // shipExplosion.gravity = 0;
  }

  updateAsteroidExplosion(asteroid) {
    // console.log('asteroid explosion', asteroid.x, asteroid.y)
    // const didCollide = game.physics.arcade.overlap(ship, asteroidGroup, change, this)
    // if (didCollide) {
    //   console.log('particle collided')
    // }
    this.asteroidExplosion.x = asteroid.x;
    this.asteroidExplosion.y = asteroid.y;
    this.asteroidExplosion.start(true, 3000, null, 50);
  }

  updateParticles() {
    this.updateShipTrail();
    this.updateShipExplosion();
  }

  asteroidsCollided(ast1, ast2) {
    // console.log('asteroidsCollided()')
    // game.add.tween(speakers.scale).to( { x: 1.3, y: 1.1 }, 230, "Sine.easeInOut", true, 0, -1, true);
    // Phaser.Tween.to(properties, duration, ease, autoStart, delay, repeat, yoyo)
    this.game.add
      .tween(ast1.scale)
      .to({ x: 1.5, y: 1.5 }, 400, 'Sine.easeInOut', true, 0, 0, true);
    this.game.add
      .tween(ast2.scale)
      .to({ x: 1.5, y: 1.5 }, 400, 'Sine.easeInOut', true, 0, 0, true);
  }
  // allow sprite to appear on other side of screen
  checkBoundaries = (sprite) => {
    if (sprite.x < 0) {
      sprite.x = this.game.width;
    } else if (sprite.x > this.game.width) {
      sprite.x = 0;
    }
    if (sprite.y < 0) {
      sprite.y = this.game.height;
    } else if (sprite.y > this.game.height) {
      sprite.y = 0;
    }
  }
  //spawn fuel canister
  createFuelCanister() {
    if (this.spawnAllowed) {
      let canister = this.fuelCanisters.create(
        this.game.world.randomX,
        this.game.world.randomY,
        'fuelCanister'
      );
      canister.anchor.set(0.5, 0.5);
      canister.scale.set(0.3, 0.3);
      console.log('canister created');
    }
  }
  //create stars
  createStars() {
    for (let i = 0; i < this.starCount; i++) {
      let star = this.starGroup.create(
        this.game.world.randomX,
        this.game.world.randomY,
        'star'
      );
      star.anchor.set(0.5, 0.5);
    }
  }
  //spawn asteroid
  createAsteroid = (x, y, size, pieces) => {
    if (pieces === undefined) {
      pieces = 1;
    }
    for (let i = 0; i < pieces; i++) {
      let asteroid = this.asteroidGroup.create(x, y, size);
      asteroid.anchor.set(0.5, 0.5);
      // Setting the asteroids to bounce off one another

      asteroid.body.bounce.setTo(1);
      asteroid.body.angularVelocity = this.game.rnd.integerInRange(
        this.asteroidProperties[size].minAngularVelocity,
        this.asteroidProperties[size].maxAngularVelocity
      );
      let randomAngle = this.game.math.degToRad(this.game.rnd.angle());
      let randomVelocity = this.game.rnd.integerInRange(
        this.asteroidProperties[size].minVelocity,
        this.asteroidProperties[size].maxVelocity
      );
      this.game.physics.arcade.velocityFromRotation(
        randomAngle,
        randomVelocity,
        asteroid.body.velocity
      );
      if (size === 'asteroid') {
        asteroid.body.setCircle(160)
        asteroid.animations.add('blink', [0, 1, 2, 3, 4, 5, 6]);
      }
    }
  }
  // blink handling
  blinkTimer() {
    let randomNum = this.game.rnd.integerInRange(1, 3);
    this.game.time.events.add(
      Phaser.Timer.SECOND * randomNum,
      this.blink,
      this
    );
  }

  blink() {
    let randomNum = this.game.rnd.integerInRange(0, 3);
    this.asteroidGroup.children[randomNum].animations.play('blink', 7, false);
  }

  resetAsteroids() {
    for (let i = 0; i < this.asteroidCount; i++) {
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
  }
  // If bullet or ship hits the collision
  asteroidCollision(target, asteroid) {
    target.kill();
    // If ship hits the asteroid
    if (target.key === 'ship') {
      // Make ship explode sound
      this.shipExplodeSound.play();
      // Make ship explode particles
      this.shipExplosion.start(true, 1000, null, 50);
      // Decrement lives
      this.startingLives--;
      this.currentLives.text = this.startingLives;
      if (this.startingLives > 0) {
        console.log('inside collision: this: ', this)
        console.log('this.reset ship', this.resetShip)
        this.game.time.events.add(
          Phaser.Timer.SECOND * this.timeToRespawn,
          this.resetShip,
          this
        );
      }
    }
    // Else the asteroid has been shot
    else {
      asteroid.kill();
      // Play sound
      this.splatSound.play();
      this.updateAsteroidExplosion(asteroid);
      this.splitAsteroid(asteroid);
    }
  }
  //pick-up canister
  canisterCollision = (target, canister) => {
    if (target.key === 'ship') {
      canister.kill();
      this.fuelLevel = 100;
      this.updateFuelBar();
      this.speed = 300;
    }
  }
  // asteroid splits
  splitAsteroid(asteroid) {
    console.log('asteroid to split', asteroid);
    if (this.asteroidProperties[asteroid.key].nextSize) {
      this.createAsteroid(
        asteroid.x,
        asteroid.y,
        this.asteroidProperties[asteroid.key].nextSize,
        this.asteroidProperties[asteroid.key].pieces
      );
    }
  }

  resetShip = () => {
    console.log('inside resetShip', this.ship)
    this.ship.reset(this.centerX, this.centerY);
    this.ship.angle = 0;
    this.fuelLevel = 100;
    this.speed = 300;
  }
  //fuel gauge creation
  createFuelBar() {
    this.meters = this.game.add.group();
    // create a plain black rectangle to use as the background of a health meter
    let meterBackgroundBitmap = this.game.add.bitmapData(20, 100);
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
    let fuelMeterBG = this.game.add.sprite(10, 10, meterBackgroundBitmap);
    fuelMeterBG.fixedToCamera = true;
    this.meters.add(fuelMeterBG);

    // create a red rectangle to use as the fuel meter
    let fuelBitmap = this.game.add.bitmapData(12, 92);
    fuelBitmap.ctx.beginPath();
    fuelBitmap.ctx.rect(0, 0, fuelBitmap.width, fuelBitmap.height);
    fuelBitmap.ctx.fillStyle = '#FF0000';
    fuelBitmap.ctx.fill();

    // create the fuel Sprite using the red rectangle bitmap data
    this.fuel = this.game.add.sprite(14, 14, fuelBitmap);
    this.meters.add(this.fuel);
    this.fuel.fixedToCamera = true;
  }
  //update fuel to decrease steadily
  updateFuelBar() {
    if (this.fuelLevel >= 0) {
      //asdf
      console.log('fuel updated');
      let m = (100 - this.fuelLevel) / 100;
      let bh = 92 - 92 * m;
      let offset = 92 - bh;
      this.fuel.key.context.clearRect(0, 0, this.fuel.width, this.fuel.height);
      this.fuel.key.context.fillRect(0, offset, 12, bh);
      this.fuel.key.dirty = true;
      this.fuelLevel -= 10;
    }
  }

  outOfFuel() {
    if (this.fuelLevel < 0) {
      this.speed = 50;
      console.log('out of fuel');
    }
  }

  gameOver() {
    if (this.startingLives <= 0) {
      this.game.state.start('gameOver');
      this.bgMusic.destroy();
      this.startingLives = 3;
    }
  }
}

export { MainGame };
