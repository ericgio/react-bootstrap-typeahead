var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/example/example.js',
  output: {
    path: __dirname + '/example/',
    filename:  'index.js'
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
