var config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  output: {
    filename:  __dirname + '/dist/react-bootstrap-typeahead.min.js'
  }
});
