var webpack = require('webpack');

module.exports = {
  entry: './src/index',
  output: {
    path: './dist',
    filename: 'react-bootstrap-typeahead.min.js',
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
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(css|scss)$/, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
