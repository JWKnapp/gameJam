import Phaser from 'phaser';

class Ship {
  constructor(game, centerX, centerY) {
    this.game = game;

    this.centerX = centerX;
    this.centerY = centerY;
    this.speed = 300;
    this.sprite = null;
    this.shipTrail = null;
    this.shipExplosion = null;
    this.shipExplodeSound = null;
  }

  preload() {
    this.game.load.spritesheet(
      'ship',
      'assets/spriteSheets/shipSheet.png',
      800,
      500
    );

    // Load particle assets
    this.game.load.image('trailParticle', 'assets/particles/bullet.png');
    this.game.load.image(
      'playerParticle',
      'assets/particles/player-particle.png'
    );
    // Sound
    this.game.load.audio('blastwave', 'assets/audio/blastwave.mp3');
  }

  create() {
    //create ship
    this.sprite = this.game.add.sprite(this.centerX, this.centerY, 'ship');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(0.1, 0.1);
    this.game.physics.enable(this.sprite);
    this.sprite.body.drag.set(70);
    this.sprite.animations.add('boost', [
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

    // Particles
    this.createShipTrail();
    this.createShipExplosion();

    // Sounds
    this.shipExplodeSound = this.game.add.audio('blastwave', 0.5);
  }

  update() {
    //ship controller
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      this.sprite.body.angularVelocity = this.speed;
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.sprite.body.angularVelocity = -this.speed;
    } else {
      this.sprite.body.angularVelocity = 0;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      this.game.physics.arcade.accelerationFromRotation(
        this.sprite.rotation,
        this.speed,
        this.sprite.body.acceleration
      );
      this.sprite.animations.play('boost', 10, true);
    } else {
      this.sprite.animations.stop('boost');
      this.sprite.frame = 0;
      this.sprite.body.acceleration.set(0);
    }
    // if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    //   this.weapon.fire();
    // }
    this.game.world.wrap(this.sprite, 0, true);

    this.updateParticles();
  }



  createShipTrail() {
    this.shipTrail = this.game.add.emitter(this.sprite.x, this.sprite.y, 150);
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
    this.shipExplosion = this.game.add.emitter(this.sprite.x, this.sprite.y, 100);
    this.shipExplosion.makeParticles('playerParticle');
    this.shipExplosion.minParticleSpeed.setTo(-200, -200);
    this.shipExplosion.maxParticleSpeed.setTo(200, 200);
    this.shipExplosion.gravity = 0;

    this.shipExplosion.setScale(5, 10, 5, 10, 2000, Phaser.Easing.Quintic.Out);
    this.shipExplosion.setAlpha(1, 0, 3000);

    // Don't turn on the explosion unless meet certain conditions in the update()
  }

  updateParticles() {
    this.updateShipTrail();
    this.updateShipExplosion();
  }

  updateShipTrail = () => {
    // Update the shipTrail to the ship's current position
    this.shipTrail.x = this.sprite.x;
    this.shipTrail.y = this.sprite.y;
    let velX = this.sprite.body.velocity.x;
    let velY = this.sprite.body.velocity.y;
    // Turn the this.shipTrail off if this.sprite speed below a certain threshold
    const epsilon = 100;
    if (
      !this.sprite.alive ||
      (Math.abs(velX) < epsilon && Math.abs(velY) < epsilon)
    ) {
      // console.log('this.sprite not moving')
      this.shipTrail.on = false;
    } else {
      // console.log('this.sprite moving', velX, velY)
      this.shipTrail.on = true;
    }

    velX *= -1;
    velY *= -1;

    this.shipTrail.minParticleSpeed.set(velX, velY);
    this.shipTrail.maxParticleSpeed.set(velX, velY);

    this.shipTrail.emitX = this.sprite.x;
    this.shipTrail.emitY = this.sprite.y;
  };

  updateShipExplosion = () => {
    this.shipExplosion.x = this.sprite.x;
    this.shipExplosion.y = this.sprite.y;
    // shipExplosion.gravity = 0;
  };

  resetShip = () => {
    console.log('inside resetShip', this.sprite);
    this.sprite.reset(this.centerX, this.centerY);
    this.sprite.angle = 0;
    this.fuelLevel = 100;
    this.speed = 300;
  };
}

export default Ship;
