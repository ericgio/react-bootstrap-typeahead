module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    '@ericgio/eslint-config-react',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  globals: {},
  overrides: [
    {
      files: ['**/*'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/extensions': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'react/jsx-no-bind': 'off',
      },
    },
    {
      files: ['**/*.stories.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'sort-keys': 'off',
      },
    },
    {
      files: ['**/*.mjs'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        'no-underscore-dangle': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-unused-vars': [
      2,
      { args: 'after-used', ignoreRestSiblings: true, vars: 'all' },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.tsx'],
      },
    ],
    'react/jsx-fragments': [2, 'syntax'],
    'react/static-property-placement': [2, 'static public field'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
