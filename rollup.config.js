/* eslint-disable sort-keys */

const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const replace = require('@rollup/plugin-replace');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { terser } = require('rollup-plugin-terser');

const { name } = require('./package.json');

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const getUmdConfig = (isProd) => ({
  input: './src/index.js',
  output: {
    file: `dist/${name}${isProd ? '.min' : ''}.js`,
    format: 'umd',
    globals,
    name: 'ReactBootstrapTypeahead',
  },
  external: Object.keys(globals),
  plugins: [
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development'
      ),
    }),
    sizeSnapshot(),
    isProd ? terser() : null,
  ],
});

module.exports = [false, true].map(getUmdConfig);
