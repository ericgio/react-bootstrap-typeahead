var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/index.js',
  output: {
    filename:  __dirname + '/dist/react-bootstrap-typeahead.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(css|scss)$/, loader: 'style-loader!css-loader' },
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
