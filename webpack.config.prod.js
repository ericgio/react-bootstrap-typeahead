var config = require('./webpack.config');

config.output.filename = 'react-bootstrap-typeahead.min.js';
config.plugins = config.plugins.concat(config.productionPlugins);

module.exports = config;
