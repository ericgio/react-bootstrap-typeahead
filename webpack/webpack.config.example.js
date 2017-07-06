var path = require('path');
var webpackConfigBase = require('./webpack.config.base');

module.exports = Object.assign(webpackConfigBase, {
  entry: './example/index.js',
  output: {
    path: path.resolve('example'),
    filename: 'package-example.js',
  },
});
