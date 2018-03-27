#!/bin/sh

# Delete existing dist & lib files
./scripts/cleanup.sh

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
./node_modules/.bin/webpack --config webpack/webpack.config.js
./node_modules/.bin/webpack --config webpack/webpack.config.prod.js

# Build ES5 modules to lib
./node_modules/.bin/babel src --out-dir lib

# Build example file
./node_modules/.bin/webpack --config webpack/webpack.config.example.prod.js
