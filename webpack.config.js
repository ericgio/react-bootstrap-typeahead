var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/src/tokenizer.js',
  output: {
    filename: 'index.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader', 'jsx-loader'], exclude: /node_modules/ },
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        except: ['$', 'exports', 'require']
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
