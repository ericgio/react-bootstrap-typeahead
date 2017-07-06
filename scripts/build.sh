#!/bin/sh

# Build minified standalone version in dist
rm -rf dist
./node_modules/.bin/webpack --config webpack/webpack.config.js
./node_modules/.bin/webpack --config webpack/webpack.config.prod.js

# Build ES5 modules to lib
rm -rf lib
./node_modules/.bin/babel src --out-dir lib

# Build example file
./node_modules/.bin/webpack --config webpack/webpack.config.example.prod.js
