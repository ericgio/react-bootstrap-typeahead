#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'css');
const STYLES_DIR = path.join(ROOT, 'styles');

console.log(chalk.cyan('Building CSS files...\n'));

// Create the output directory if it doesn't exist.
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

fs.readdirSync(STYLES_DIR).forEach((filename) => {
  const file = path.join(STYLES_DIR, filename);

  // Include the .scss files in the package by simply copying them over.
  fs.copyFileSync(file, path.join(OUT_DIR, filename));

  // Output both expanded and minified versions.
  ['compressed', 'expanded'].forEach((style) => {
    // Get the base filename.
    let name = filename.replace('.scss', '');
    if (style === 'compressed') {
      // Denote minified CSS.
      name += '.min';
    }

    const result = sass.compile(file, { style });

    fs.writeFileSync(path.join(OUT_DIR, `${name}.css`), result.css);
  });
});

console.log(chalk.cyan('Done.\n'));
