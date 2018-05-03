#!/bin/sh

# Delete existing dist & lib files
npm run clean

# Compile SCSS file to development and prod CSS files
for file in scss/Typeahead*; do
  filename=$(basename "$file")
  extension="${filename##*.}"
  filename="${filename%.*}"

  ./node_modules/node-sass/bin/node-sass ${file} css/${filename}.css \
    --output-style expanded

  ./node_modules/node-sass/bin/node-sass ${file} css/${filename}.min.css \
    --output-style compressed
done;

# Build minified standalone version in dist
./node_modules/.bin/webpack --mode development
./node_modules/.bin/webpack --mode production

# Build ES5 modules to lib
./node_modules/.bin/babel src --out-dir lib

# Build minified example file
./node_modules/.bin/webpack --config example/webpack.config.js --mode production
