var config = require('./webpack.config');
var webpackProdPlugins = require('./webpackProdPlugins');

var prodConfig = Object.assign({}, config);
prodConfig.output.filename = 'react-bootstrap-typeahead.min.js';
prodConfig.plugins = config.plugins.concat(webpackProdPlugins);

module.exports = prodConfig;
