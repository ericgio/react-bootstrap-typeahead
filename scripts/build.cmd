REM Delete existing dist & lib files
scripts/cleanup

REM Compile SCSS file
"node_modules/node-sass/bin/node-sass" scss/Typeahead.scss css/Typeahead.css --output-style expanded

REM Build minified standalone version in dist
"node_modules/.bin/webpack" --config webpack/webpack.config.js
"node_modules/.bin/webpack" --config webpack/webpack.config.prod.js

REM Build ES5 modules to lib
"node_modules/.bin/babel" src --out-dir lib

REM Build example file
"node_modules/.bin/webpack" --config webpack/webpack.config.example.prod.js
