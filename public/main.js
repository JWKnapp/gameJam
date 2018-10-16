import state0 from './state0'
import stateOver from './stateOver'
import {game, demo} from './stateStartScreen'
// let game = new Phaser.Game(3000, 1500, Phaser.AUTO);

// start screen
game.state.add('stateStartScreen', demo.stateStartScreen)

//main game
game.state.add('state0', state0);

// // Particles
// game.state.add('state50', demo.state50);

//gameover
game.state.add('stateOver', stateOver)

// What state to start
game.state.start('stateStartScreen');

