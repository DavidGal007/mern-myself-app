const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dev-build'),
    filename: '[name].js',
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    },
    extensions: ['.js'],
  },
  //devtool: 'source-map',
};
