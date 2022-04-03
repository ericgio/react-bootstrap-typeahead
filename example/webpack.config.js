const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: path.join(__dirname, 'src/index.tsx'),
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
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
      path: path.resolve('.'),
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
        'react-bootstrap-typeahead': path.resolve(
          __dirname,
          '..',
          'src/index.ts'
        ),
      },
      extensions: ['.ts', '.tsx', '.js'],
    },
    stats: {
      warnings: argv.mode !== 'production',
    },
  };
};
