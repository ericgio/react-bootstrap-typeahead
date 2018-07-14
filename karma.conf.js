/* eslint-env node */

var webpackConfigBase = require('./webpack.config.base');

module.exports = function(config) {
  config.set({
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : /*'Chrome',*/ 'Firefox'],
    client: {
      // Don't show console output.
      captureConsole: true,
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    files: ['test/components/a11yResultsSpec.js'/*, 'test/index.js'*/],
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      'test/components/a11yResultsSpec.js': ['webpack', 'sourcemap'],
      'test/index.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots'],
    singleRun: true,
    webpack: Object.assign(webpackConfigBase, {
      devtool: 'inline-source-map',
      mode: 'development',
    }),
    webpackServer: {
      noInfo: true,
    },
  });
};
 