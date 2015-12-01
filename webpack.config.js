var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/example/example.js',
  output: {
    filename:  __dirname + '/example/index.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(css|scss)$/, loader: 'style-loader!css-loader' },
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    /*
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        except: ['$', 'exports', 'require']
      }
    })
    */
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
