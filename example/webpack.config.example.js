var webpackConfigBase = require('../webpack.config.base');

module.exports = Object.assign(webpackConfigBase, {
  entry: './example/example.js',
  output: {
    path: './example',
    filename: 'index.js',
  },
});
