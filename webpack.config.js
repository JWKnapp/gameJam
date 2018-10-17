const path = require('path');

const phaserModulePath = path.join(__dirname, '/node_modules/phaser/');

module.exports = {
  entry: [
    '@babel/polyfill', // enables async-await
    './src/main.js',
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      phaser: path.join(phaserModulePath, 'build/custom/phaser-split.js'),
      pixi: path.join(phaserModulePath, 'build/custom/pixi.js'),
      p2: path.join(phaserModulePath, 'build/custom/p2.js'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js/, loader: 'expose-loader?p2' },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
