var path = require('path');
var config = require('../webpack.config.base');

module.exports = function(env) {
  return Object.assign(config(env), {
    entry: './example/index.js',
    output: {
      filename: 'package-example.js',
      path: path.resolve('example'),
    },
  });
};
