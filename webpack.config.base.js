var webpack = require('webpack');

var prodPlugins = [
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

module.exports = function(env) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/, /* eslint-disable sort-keys */
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: env === 'production' ? prodPlugins : [],
    resolve: {
      extensions: ['.js', '.react.js'],
    },
  };
};
