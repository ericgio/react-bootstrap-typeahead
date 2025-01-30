#!/usr/bin/env node

import ghpages from 'gh-pages';
import pkg from '../package.json' assert { type: 'json' };

/**
 * Don't publish pre-release versions, as denoted by the presence of a hyphen
 * in the version number, (eg: 3.0.0-rc.1).
 *
 * See: https://semver.org/#spec-item-9
 */
if (pkg.version.split('-').length === 1) {
  ghpages.publish('example', {
    message: `v${pkg.version}`,
    src: '{index.html,package-example.js,public/*}',
  });
} else {
  console.log(
    `Skipped deploying examples for pre-release version: v${pkg.version}`
  );
}
