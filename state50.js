// Global state
// let demo = {},
//   centerX = 2000 / 2,
//   centerY = 1500 / 2,
//   ship,
//   speed = 6;

demo.state50 = function() {};

demo.state50.createPlayerEmitter = function() {
  // Make the player explode
  var playerEmitter = game.add.emitter(ship.x, ship.y, 100);
  playerEmitter.makeParticles('playerParticle');
  playerEmitter.minParticleSpeed.setTo(-200, -200);
  playerEmitter.maxParticleSpeed.setTo(200, 200);
  playerEmitter.gravity = 0;
  // true (single particle emission [single explosion]),
  // 1000 (last 1 sec),
  // null (for repeating emissions [how many per emission])
  // 100 particles on this single explosion
  playerEmitter.start(true, 1000, null, 100);
};

demo.state50.createShipTrailOrig = function() {
  let shipTrail;
  let x = 50;
  let y = 50;
  shipTrail = game.add.emitter(x, y + 10, 400);
  shipTrail.width = 50;
  shipTrail.makeParticles('bullet');
  shipTrail.setXSpeed(30, -30);
  shipTrail.setYSpeed(200, 180);
  shipTrail.setRotation(50, -50);
  shipTrail.setAlpha(1, 0.01, 800);
  // minX, maxX, minY, maxY, rate, ease, yoyo
  shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.start(false, 5000, 10);
};

demo.state50.createShipTrail = function() {
  let shipTrail;
  // let x = 50;
  // let y = 50;
  shipTrail = game.add.emitter(ship.x, ship.y + 60, 400);
  shipTrail.width = 75;
  shipTrail.makeParticles('bullet');
  shipTrail.setXSpeed(30, -30);
  shipTrail.setYSpeed(200, 180);
  shipTrail.setRotation(0, 0);
  // startAlpha, endAlpha, ms
  // setAlpha(min, max, rate, ease, yoyo)
  //   The rate (in ms) parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
  // If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
  shipTrail.setAlpha(1, 0.01, 1500, Phaser.Easing.Quintic.Out); //800
  // minX, maxX, minY, maxY, rate, ease, yoyo
  // shipTrail.setScale(0.5, 2, 0.5, 2, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.setScale(0.5, 2, 0.5, 2, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.start(false, 5000, 10);
};

demo.state50.createMyPtc = function() {
  let myPtc = game.add.emitter(500, 500, 400);
  myPtc.makeParticles('bullet');
  myPtc.gravity = 0;
  // myPtc.rotation = 1;
  myPtc.maxRotation = 0;
  myPtc.minRotation = 0;
  // myPtc.setScale(0.05, 0.4, 0.05, 0.4, 3500, Phaser.Easing.Quintic.Out);
  myPtc.start(true, 2000, null, 20);
};

demo.state50.createRadialPtc = function(manager) {
  var data = {
    lifespan: 4000,
    image: 'bullet',
    velocity: {
      initial: 2,
      radial: { arcStart: 0, arcEnd: 360 },
      control: [{ x: 0, y: 1 }, { x: 0.5, y: 0.5 }, { x: 1, y: 0 }],
    },
  };
  manager.addData('basic', data);
  let emitter = manager.createEmitter();
  emitter.addToWorld();
  emitter.emit('basic', 400, 400, { repeat: -1, frequency: 10 });
};

demo.state50.createRadialPtcDot = function() {
  // Make the player explode
  var playerEmitter = game.add.emitter(ship.x, ship.y, 100);
  playerEmitter.makeParticles('playerParticle');
  // playerEmitter.minParticleSpeed.setTo(-200, -200);
  // playerEmitter.maxParticleSpeed.setTo(200, 200);
  playerEmitter.gravity = 0;
  playerEmitter.setScale(5, 10, 5, 10, 2000, Phaser.Easing.Quintic.Out);
  // true (single particle emission [single explosion]),
  // 1000 (last 1 sec),
  // null (for repeating emissions [how many per emission])
  // 100 particles on this single explosion
  playerEmitter.start(true, 2500, null, 50);
};

demo.state50.prototype = {
  preload: function() {
    game.load.image('ship', 'assets/sprites/ship.png', 500, 500);
    game.load.image('space', 'assets/backgrounds/space.png');

    // Particle images
    game.load.image('bullet', '/assets/particles/bullet.png');
    game.load.image('playerParticle', '/assets/particles/player-particle.png');
  },
  create: function() {


    var manager = game.plugins.add(Phaser.ParticleStorm);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Render the spaceship and bg
    game.world.setBounds(0, 0, 3000, 3000);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    let spaceBG = game.add.sprite(0, 0, 'space');
    ship = game.add.sprite(centerX, centerY, 'ship');
    ship.anchor.setTo(0.5, 0.5);
    ship.scale.setTo(0.2, 0.2);
    game.physics.enable(ship);

    // Render emitters

    // demo.state50.createRadialPtc(manager);

    demo.state50.createRadialPtcDot();

    demo.state50.createShipTrail();
    // demo.state50.createMyPtc();
    // demo.state50.createPlayerEmitter();
  },
  update: function() {},
};
