import Phaser from 'phaser';

class Asteroid {
  constructor(game) {
    this.game = game;

    this.asteroidExplosion = null;
  }

  preload() {}

  create() {
    this.createAsteroidExplosion();
  }

  update() {}

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

export default Asteroid;
