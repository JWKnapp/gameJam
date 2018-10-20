import Phaser from 'phaser';


const blink = ([game, instance]) => {
  console.log('calling blink()');
  let randomNum = game.rnd.integerInRange(0, 3);
  instance.group.children[randomNum].animations.play('blink', 7, false);
};

// blink handling
function blinkTimer(game, instance) {
  console.log('blinkTimer()')
  let randomNum = game.rnd.integerInRange(1, 3);
  game.time.events.add(
    Phaser.Timer.SECOND * randomNum,
    blink,
    this,
    [game, instance]
  );
}

class AsteroidGroup {
  constructor(game, ship) {
    this.game = game;
    this.ship = ship;

    this.group = null;
    this.props = {
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
    this.asteroidCount = this.props.startingAsteroids;
    this.asteroidExplosion = null;
  }

  preload() {
    this.game.load.image('smallAsteroid', 'assets/sprites/smallMonster.png');
    this.game.load.image('medAsteroid', 'assets/sprites/medMonster.png');
    this.game.load.spritesheet(
      'asteroid',
      'assets/spriteSheets/eyeMonsterSheet.png',
      320,
      320
    );
  }

  create() {
    //asteroid group
    console.log('asteroidGroup create() called')
    this.group = this.game.add.group();
    this.group.enableBody = true;
    this.group.physicsBodyType = Phaser.Physics.ARCADE;
    this.game.physics.enable([this.group]);
    console.log('before resetAsteroids() group length:', this.group.length)
    this.resetAsteroids();
    console.log('after resetAsteroids() group length:', this.group.length)
    this.createAsteroidExplosion();
  }

  update() {
    this.group.forEachExists(this.checkBoundaries);
  }

  // size can be: 'asteroid'
  //spawn asteroid
  createAsteroid = (x, y, name, numPieces = 1) => {
    // console.log('createAsteroid(', x, y, name, numPieces, ')');
    for (let i = 0; i < numPieces; i++) {
      // Create a new asteroid as part of the group
      let asteroid = this.group.create(x, y, name);
      asteroid.anchor.set(0.5, 0.5);
      // Setting the asteroids to bounce off one another

      asteroid.body.bounce.setTo(1);
      asteroid.body.angularVelocity = this.game.rnd.integerInRange(
        this.props[name].minAngularVelocity,
        this.props[name].maxAngularVelocity
      );
      let randomAngle = this.game.math.degToRad(this.game.rnd.angle());
      let randomVelocity = this.game.rnd.integerInRange(
        this.props[name].minVelocity,
        this.props[name].maxVelocity
      );
      this.game.physics.arcade.velocityFromRotation(
        randomAngle,
        randomVelocity,
        asteroid.body.velocity
      );
      if (name === 'asteroid') {
        asteroid.body.setCircle(160);
        asteroid.animations.add('blink', [0, 1, 2, 3, 4, 5, 6]);
      }
    }
  };

  // blink handling
  blinkTimer() {
    // console.log('instance blinkTimer() called. group length:', this.group.length)
    // console.log('asteroidCount:', this.asteroidCount)
    blinkTimer(this.game, this)
  }

  resetAsteroids() {
    // console.log('resetAsteroids()');
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
      // console.log('about to run createAsteroid(', x, y, ')');
      this.createAsteroid(x, y, 'asteroid');
    }
  }

  // asteroid splits
  splitAsteroid(asteroid) {
    console.log('asteroid to split', asteroid);
    if (this.props[asteroid.key].nextSize) {
      this.createAsteroid(
        asteroid.x,
        asteroid.y,
        this.props[asteroid.key].nextSize,
        this.props[asteroid.key].pieces
      );
    }
  }

  // allow sprite to appear on other side of screen
  checkBoundaries = sprite => {
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
  };

  createAsteroidExplosion() {
    this.asteroidExplosion = this.game.add.emitter(
      this.ship.sprite.x,
      this.ship.sprite.y,
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
}

export default AsteroidGroup;
