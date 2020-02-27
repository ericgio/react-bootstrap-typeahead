const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: path.join(__dirname, 'src/index.js'),
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.js$/,
          use: [
            'babel-loader',
          ],
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
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    },
    output: {
      filename: 'package-example.js',
      path: path.resolve('example'),
    },
    plugins: [
      new CircularDependencyPlugin({
        allowAsyncCycles: false,
        cwd: process.cwd(),
        exclude: /node_modules/,
        failOnError: true,
      }),
    ],
    resolve: {
      alias: {
        'react-bootstrap-typeahead$': path.resolve(
          __dirname, '..', 'src/index.js'
        ),
      },
      extensions: ['.js'],
    },
    stats: {
      warnings: argv.mode !== 'production',
    },
  };
};
