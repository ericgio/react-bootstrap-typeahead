# React Bootstrap Typeahead
React-based typeahead component that uses Bootstrap as a base for styles and behaviors and supports both single- and multi-selection. The UI and behaviors are inspired by Twitter's [typeahead.js](https://github.com/twitter/typeahead.js). Try the [live examples](http://ericgio.github.io/react-bootstrap-typeahead/2.0/).

[![npm version](https://img.shields.io/npm/v/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![npm downloads](https://img.shields.io/npm/dm/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![build status](https://img.shields.io/travis/ericgio/react-bootstrap-typeahead/master.svg?style=flat-square)](https://travis-ci.org/ericgio/react-bootstrap-typeahead)
[![cdnjs](https://img.shields.io/cdnjs/v/react-bootstrap-typeahead.svg?style=flat-square)](https://cdnjs.com/libraries/react-bootstrap-typeahead)

Please note that this library is under active development and the APIs may change. The documentation below applies to the most recent version and may no longer be applicable if you're using an outdated version.

## Installation
Use NPM to install the module:
```
$ npm install --save react-bootstrap-typeahead
```

Include the module in your project:
```jsx
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
var Typeahead = require('react-bootstrap-typeahead').Typeahead; // CommonJS
```

Minified and unminified UMD modules are also included in the NPM package, or you can [get them from CDNJS](https://cdnjs.com/libraries/react-bootstrap-typeahead).

## Documentation
- [Basic Usage](docs/Usage.md)
- [Data](docs/Data.md)
- [Filtering](docs/Filtering.md)
- [Rendering](docs/Rendering.md)
- [Public Methods](docs/Methods.md)
- [Props](docs/Props.md)
- [API](docs/API.md)
- [Upgrade Guide](docs/Upgrading.md)

## CSS
The component tries to use as little CSS as possible, relying primarily on Bootstrap or any Bootstrap themes for styling. Some minimal CSS comes with the module and should be included wherever you're using the component.

## Examples
Try the [live examples](http://ericgio.github.io/react-bootstrap-typeahead/), which also include code samples. If you'd like to modify the examples, clone the repository, `npm install` and `npm run example` to build the example file. You can then open the HTML file locally in your browser.

## Browser Support
Recent versions of the following browsers are supported:
- Chrome
- Firefox
- IE (10/11)
- Safari

Special thanks to [BrowserStack](https://www.browserstack.com) for providing cross-browser testing support.

[![http://i.imgur.com/9aLP6Fx.png?1](http://i.imgur.com/9aLP6Fx.png?1)](https://www.browserstack.com)

## License
[MIT](https://github.com/ericgio/react-bootstrap-typeahead/blob/master/LICENSE.md)
