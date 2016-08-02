var webpackBaseConfig = require('./webpack.base.config');

module.exports = function(config) {
  config.set({
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],
    frameworks: ['mocha', 'chai'],
    singleRun: true,
    files: [
      'tests.webpack.js',
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots'],
    webpack: Object.assign(webpackBaseConfig, {
      devtool: 'inline-source-map',
    }),
    webpackServer: {
      noInfo: true,
    },
  });
};
