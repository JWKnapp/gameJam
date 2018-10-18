import Phaser from 'phaser';

class Weapon {
  constructor(game, ship) {
    this.game = game;
    this.ship = ship;

    this.entity = null;
  }

  preload() {
    this.game.load.image('bullet', 'assets/sprites/bullet.png');
  }

  create() {
    //ship gun
    this.entity = this.game.add.weapon(30, 'bullet');
    // weapon.scale.setTo(10, 10);
    this.entity.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.entity.bulletSpeed = this.ship.speed;
    this.entity.fireRate = 1000;
    this.entity.trackSprite(this.ship.sprite, 20, 20, true);
    this.entity.enableBody = true;
    this.entity.physicsBodyType = Phaser.Physics.ARCADE;
  }

  update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.entity.fire();
    }
  }
}

export default Weapon;
