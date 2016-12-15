#!/bin/sh

# Build example file for development
./node_modules/.bin/webpack -w --progress --colors --config example/webpack.config.example.js
