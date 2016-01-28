var config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  devtool: 'source-map',
  entry: __dirname + '/lib/Typeahead.react.js',
  externals: {
    'cx': 'classnames',
    'lodash': 'lodash',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-input-autosize': 'AutosizeInput',
    'react-onclickoutside': 'onClickOutside',
  },
  output: {
    path:  __dirname + '/build/'
  }
});
