import 'pixi';
import 'p2';
import Phaser from 'phaser';
import {MainGame} from './mainGame'
import {GameOver} from './gameOver'
import {StartScreen} from './stateStartScreen'


const game = new Phaser.Game(3000, 1500, Phaser.AUTO);

const startScreen = new StartScreen(game);

const mainGame = new MainGame(game)

const gameOver = new GameOver(game)

// start screen
game.state.add('stateStartScreen', startScreen)

//main game
game.state.add('mainGame', mainGame);

// // Particles
// game.state.add('state50', demo.state50);

//gameover
game.state.add('gameOver', gameOver)

// What state to start
game.state.start('stateStartScreen');

