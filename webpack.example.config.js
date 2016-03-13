var webpack = require('webpack');

module.exports = {
  entry: './example/example.js',
  output: {
    path: './example',
    filename:  'index.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
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
