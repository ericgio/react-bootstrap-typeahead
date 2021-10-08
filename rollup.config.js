/* eslint-disable sort-keys, @typescript-eslint/no-var-requires */

const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { terser } = require('rollup-plugin-terser');

const { name } = require('./package.json');

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

const getUmdConfig = (isProd) => ({
  input: './src/index.ts',
  output: {
    file: `./dist/${name}${isProd ? '.min' : ''}.js`,
    format: 'umd',
    globals,
    name: 'ReactBootstrapTypeahead',
  },
  external: Object.keys(globals),
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
      extensions,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development'
      ),
      preventAssignment: true,
    }),
    sizeSnapshot(),
    isProd ? terser() : null,
  ],
});

module.exports = [false, true].map(getUmdConfig);
