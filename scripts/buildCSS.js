#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

function buildCSS(options, outdir) {
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

    fs.writeFileSync(path.join(outdir, `${filename}.css`), result.css);
  });
}

const rootDir = path.join(__dirname, '..');

// Create the output directory if it doesn't already exist
const outdir = path.join(rootDir, 'css');
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

const sassFiles = fs.readdirSync(path.join(rootDir, 'scss'));
sassFiles.forEach((filename) => {
  if (filename.indexOf('Typeahead') === -1) {
    return;
  }

  const file = path.join(rootDir, 'scss', filename);

  // Output both expanded and minified versions.
  ['compressed', 'expanded'].forEach(outputStyle => {
    buildCSS({file, outputStyle}, outdir);
  });
});
