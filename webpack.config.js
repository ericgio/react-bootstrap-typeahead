const config = require('./webpack.config.base');
const path = require('path');

module.exports = (env, argv) => {
  const filename = argv.mode === 'production' ?
    'react-bootstrap-typeahead.min.js' :
    'react-bootstrap-typeahead.js';

  return Object.assign(config, {
    entry: './src/index',
    output: {
      path: path.resolve('dist'),
      filename,
      library: 'ReactBootstrapTypeahead',
      libraryTarget: 'umd'
    },
    externals: [{
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }, {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }],
  });
};
