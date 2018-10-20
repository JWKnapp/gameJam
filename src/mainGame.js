import Phaser from 'phaser';
import Ship from './objects/Ship';
import Weapon from './objects/Weapon';
import AsteroidGroup from './objects/AsteroidGroup'

class MainGame {
  constructor(game) {
    this.game = game;
    this.bgMusic = null;
    this.centerX = 3000 / 2;
    this.centerY = 1500 / 2;
    this.spawnAllowed = true;

    this.startingLives = 3;
    this.timeToRespawn = 3;

    this.fontStuff = {
      font: '100px Arial',
      fill: '#FFFFFF',
      align: 'center',
    };
    this.fuelLevel = 100;
    this.starCount = 20;
    this.ship = new Ship(game, this.centerX, this.centerY);

    this.asteroidGroup = new AsteroidGroup(game, this.ship);

    this.currentLives = null;
    this.fuelCanisters = null;
    this.meters = null;
    this.fuel = null;
    this.fuelTimer = null;
    this.starGroup = null;

    this.weapon = new Weapon(game, this.ship);

    this.bgMusic = null;
    this.splatSound = null;

    this.independentObjects = [this.ship, this.weapon, this.asteroidGroup];
  }

  preload() {
    this.game.load.image('fuelCanister', 'assets/sprites/fuelCanister.png');
    this.game.load.image('star', 'assets/sprites/bullet.png');

    // Load sounds
    // For Firefox can't use mp3
    this.game.load.audio('bgMusic', 'assets/audio/creeping-blob.mp3');
    this.game.load.audio('splatSound', 'assets/audio/splat.mp3');

    this.independentObjects.forEach(obj => {
      obj.preload();
    });
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

    this.independentObjects.forEach(obj => {
      obj.create();
    });

    //random fuel cells
    this.fuelCanisters = this.game.add.group();
    this.fuelCanisters.enableBody = true;
    this.game.time.events.repeat(
      Phaser.Timer.SECOND * this.game.rnd.integerInRange(10, 30),
      50,
      this.createFuelCanister,
      this
    );

    // **Continually adding new timers b/c blinkTimer adds a timer?
    this.game.time.events.repeat(
      Phaser.Timer.SECOND * this.game.rnd.integerInRange(2, 10),
      500,
      this.asteroidGroup.blinkTimer,
      this.asteroidGroup
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
    // this.createAsteroidExplosion();
    // Set layering of images and particles
    // game.world.sendToBack(shipTrail);
    this.game.world.bringToTop(this.ship.sprite);
    // Sounds
    // key, volume = 1, loop? = false
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
    this.bgMusic.play();
    this.splatSound = this.game.add.audio('splatSound');
  }

  update() {
    const gameCxt = this;

    // //ship controller
    this.independentObjects.forEach(obj => {
      obj.update();
    });

    // Collisions
    this.game.physics.arcade.overlap(
      this.weapon.entity.bullets,
      this.asteroidGroup.group,
      this.asteroidCollision,
      null,
      gameCxt
    );
    const collider = this.game.physics.arcade.overlap(
      this.ship.sprite,
      this.asteroidGroup.group,
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
      this.ship.sprite,
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

  // If bullet or ship hits the collision
  asteroidCollision(target, asteroid) {
    target.kill();
    // If ship hits the asteroid
    if (target.key === 'ship') {
      // Make ship explode sound
      this.ship.shipExplodeSound.play();
      // Make ship explode particles
      this.ship.shipExplosion.start(true, 1000, null, 50);
      // Decrement lives
      this.startingLives--;
      this.currentLives.text = this.startingLives;
      if (this.startingLives > 0) {
        console.log('inside collision: this: ', this);
        console.log('this.reset ship', this.resetShip);
        this.game.time.events.add(
          Phaser.Timer.SECOND * this.timeToRespawn,
          this.ship.resetShip,
          this
        );
      }
    }
    // Else the asteroid has been shot
    else {
      asteroid.kill();
      // Play sound
      this.splatSound.play();
      this.asteroidGroup.updateAsteroidExplosion(asteroid);
      this.asteroidGroup.splitAsteroid(asteroid);
    }
  }

  //pick-up canister
  canisterCollision = (target, canister) => {
    if (target.key === 'ship') {
      canister.kill();
      this.fuelLevel = 100;
      this.updateFuelBar();
      this.ship.speed = 300;
    }
  };

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
      this.ship.speed = 50;
      // console.log('out of fuel');
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

export default MainGame;
