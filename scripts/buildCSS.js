#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies,no-console */

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'css');
const STYLES_DIR = path.join(ROOT, 'styles');

function buildCSS(options) {
  // Get the base filename.
  let filename = options.file
    .split('/')
    .pop()
    .replace('.scss', '');

  // Denote minified CSS.
  if (options.outputStyle === 'compressed') {
    filename = `${filename}.min`;
  }

  // Render CSS files.
  sass.render(options, (err, result) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    fs.writeFileSync(path.join(OUT_DIR, `${filename}.css`), result.css);
  });
}

// Create the output directory if it doesn't exist.
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

fs.readdirSync(STYLES_DIR).forEach((filename) => {
  const file = path.join(STYLES_DIR, filename);

  // Include the .scss files in the package by simply copying them over.
  fs.copyFileSync(file, path.join(OUT_DIR, filename));

  // Output both expanded and minified versions.
  ['compressed', 'expanded'].forEach((outputStyle) => {
    buildCSS({
      file,
      outputStyle,
    });
  });
});
