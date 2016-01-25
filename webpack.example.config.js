var config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  entry: __dirname + '/example/example.js',
  output: {
    filename:  __dirname + '/example/index.js'
  }
});
