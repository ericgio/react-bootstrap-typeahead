const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: './example/index.js',
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
        new UglifyJsPlugin({
          uglifyOptions: {
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
      extensions: ['.js'],
    },
    stats: {
      warnings: argv.mode !== 'production',
    },
  };
};
