var webpackConfigBase = require('../webpack.config.base');

module.exports = Object.assign(webpackConfigBase, {
  entry: './example/index.js',
  output: {
    path: './example',
    filename: 'package-example.js',
  },
});
