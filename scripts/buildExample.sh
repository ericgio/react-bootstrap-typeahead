#!/bin/sh

# Initial compile of CSS file
./node_modules/node-sass/bin/node-sass scss/Typeahead.scss css/Typeahead.css \
  --output-style expanded

# Build example file for development
./node_modules/.bin/webpack -w --progress --colors --config webpack/webpack.config.example.js
