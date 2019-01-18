#!/usr/bin/env node

const ghpages = require('gh-pages');
const {version} = require('../package.json');

ghpages.publish('example', {
  message: `v${version}`,
  src: '{index.html,package-example.js,assets/*}',
});
