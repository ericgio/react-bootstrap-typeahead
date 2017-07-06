var webpack = require('webpack');

module.exports = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      screw_ie8: true,
      warnings: false,
    },
    mangle: {
      except: ['$', 'exports', 'require'],
    },
  }),
];
