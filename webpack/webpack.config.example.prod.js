var config = require('./webpack.config.example');
var webpackProdPlugins = require('./webpackProdPlugins');

module.exports = Object.assign({}, config, {
  plugins: config.plugins.concat(webpackProdPlugins),
});
