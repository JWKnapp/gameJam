import Asteroid from './Asteroid'

class AsteroidSmall extends Asteroid {
  // constructor(game) {
  //   super(game);
  // }

  preload() {
    this.game.load.image('smallAsteroid', 'assets/sprites/smallMonster.png');
  }

  create() {

  }

  update() {

  }
}

export default AsteroidSmall;
