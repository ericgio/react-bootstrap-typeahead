#!/usr/bin/env node

const ghpages = require('gh-pages');
const {version} = require('../package.json');

/**
 * Don't publish pre-release versions, as denoted by the presence of a hyphen
 * in the version number, (eg: 3.0.0-rc.1).
 *
 * See: https://semver.org/#spec-item-9
 */
if (version.split('-').length === 1) {
  ghpages.publish('example', {
    message: `v${version}`,
    src: '{index.html,package-example.js,assets/*}',
  });
} else {
  console.log(
    `Skipped deploying examples for pre-release version: v${version}`
  );
}
