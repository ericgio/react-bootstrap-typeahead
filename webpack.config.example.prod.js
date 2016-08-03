var config = require('./webpack.config.example');

config.plugins = config.plugins.concat(config.productionPlugins);

module.exports = config;
