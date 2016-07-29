#!/bin/sh

# Build minified standalone version in dist
rm -rf build
./node_modules/.bin/webpack --output-filename=react-bootstrap-typeahead.js
./node_modules/.bin/webpack --output-filename=react-bootstrap-typeahead.min.js --optimize-minimize

# Build ES5 modules to lib
rm -rf lib
./node_modules/.bin/babel src --out-dir lib --presets es2015,react --plugins lodash

# Build example file
rm example/index.js
./node_modules/.bin/webpack --config webpack.example.config.js --optimize-minimize
