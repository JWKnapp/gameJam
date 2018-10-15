let game = new Phaser.Game(3000, 1500, Phaser.AUTO);
game.state.add('state0', demo.state0);

// Particles
game.state.add('state50', demo.state50);

//gameover
game.state.add('stateOver', demo.stateOver)

// What state to start
game.state.start('state0');
