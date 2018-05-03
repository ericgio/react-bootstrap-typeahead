const config = require('../webpack.config.base');
const path = require('path');

module.exports = (env, argv) => {
  return Object.assign(config, {
    entry: './example/index.js',
    output: {
      filename: 'package-example.js',
      path: path.resolve('example'),
    },
    stats: {
      warnings: argv.mode !== 'production',
    },
  });
};
