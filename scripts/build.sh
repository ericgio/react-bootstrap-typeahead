#!/bin/sh

# Delete existing dist & lib files
./scripts/cleanup.sh

# Build minified standalone version in dist
./node_modules/.bin/webpack --config webpack/webpack.config.js
./node_modules/.bin/webpack --config webpack/webpack.config.prod.js

# Build ES5 modules to lib
./node_modules/.bin/babel src --out-dir lib

# Build example file
./node_modules/.bin/webpack --config webpack/webpack.config.example.prod.js
