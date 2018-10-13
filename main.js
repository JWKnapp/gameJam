let game = new Phaser.Game(2000, 1500, Phaser.AUTO);
game.state.add('state0', demo.state0);
game.state.start('state0');
