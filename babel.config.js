/* eslint-disable sort-keys,no-template-curly-in-string */

// `ignore` option doesn't support wildcard for extension.
// https://github.com/babel/babel/issues/12008
const moduleIgnore = [
  '**/*.stories.tsx',
  '**/*.test.tsx',
  '**/*.test.ts',
  'src/tests/*',
  'src/types.ts',
];

module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      "runtime": "automatic"
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    'dev-expression',
    [
      'transform-imports',
      {
        lodash: {
          transform: 'lodash/${member}',
          preventFullImport: true,
        },
        'react-overlays': {
          transform: 'react-overlays/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
  env: {
    cjs: {
      plugins: [
        '@babel/transform-runtime',
        '@babel/transform-modules-commonjs',
      ],
      ignore: moduleIgnore,
    },
    es: {
      plugins: ['@babel/transform-runtime'],
      ignore: moduleIgnore,
    },
    production: {
      plugins: ['transform-react-remove-prop-types'],
    },
    test: {
      plugins: [
        '@babel/transform-runtime',
        '@babel/transform-modules-commonjs',
      ],
    },
  },
};
