import Asteroid from './Asteroid'

class AsteroidBig extends Asteroid {
  // constructor(game) {
  //   super(game);
  // }

  preload() {
    this.game.load.spritesheet(
      'asteroid',
      'assets/spriteSheets/eyeMonsterSheet.png',
      320,
      320
    );
  }

  create() {

  }

  update() {

  }
}

export default AsteroidBig;
