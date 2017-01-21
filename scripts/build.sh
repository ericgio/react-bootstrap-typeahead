#!/bin/sh

# Build minified standalone version in dist
rm -rf dist
./node_modules/.bin/webpack
./node_modules/.bin/webpack --config webpack.config.prod.js

# Build ES5 modules to lib
rm -rf lib
./node_modules/.bin/babel src --out-dir lib

# Copy typings
cp src/index.d.ts lib/index.d.ts

# Build example file
rm example/index.js
./node_modules/.bin/webpack --config example/webpack.config.example.prod.js
