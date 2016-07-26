var webpackBaseConfig = require('./webpack.base.config');

module.exports = Object.assign(webpackBaseConfig, {
  entry: './example/example.js',
  output: {
    path: './example',
    filename:  'index.js'
  },
});
