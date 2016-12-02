# React Bootstrap Typeahead
React-based typeahead component that uses Bootstrap as a base for styles and behaviors and supports both single- and multi-selection. The UI and behaviors are inspired by Twitter's [typeahead.js](https://github.com/twitter/typeahead.js). Try a [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

[![npm version](https://img.shields.io/npm/v/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![npm downloads](https://img.shields.io/npm/dm/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![build status](https://img.shields.io/travis/ericgio/react-bootstrap-typeahead/master.svg?style=flat-square)](https://travis-ci.org/ericgio/react-bootstrap-typeahead)
[![cdnjs](https://img.shields.io/cdnjs/v/react-bootstrap-typeahead.svg?style=flat-square)](https://cdnjs.com/libraries/react-bootstrap-typeahead)

Please note that this library is under active development and the APIs may change. The documentation below applies to the most recent version and may no longer be applicable if you're using an outdated version.

## v1.0.0 (beta)
A pre-release of v1.0 is now available. This version has some breaking changes; please see the [release notes](https://github.com/ericgio/react-bootstrap-typeahead/releases) for more information. The code is reasonably stable, but could use some additional real-world testing. New examples and better documentation are currently the main things gating a full release.

The latest stable version is v0.10.4

## Installation
Use NPM to install the module in your project:
```
npm install --save react-bootstrap-typeahead
```

Include the module in your project as you normally would:
```jsx
// Using ES2015 modules
import Typeahead from 'react-bootstrap-typeahead';

// Using CommonJS (Note: you must add `.default`)
var Typeahead = require('react-bootstrap-typeahead').default;
```

Minified and unminified UMD modules are also included in the NPM package, or you can [get them from CDNJS](https://cdnjs.com/libraries/react-bootstrap-typeahead).

## Documentation
- [Basic Usage](docs/Usage.md)
- [Data](docs/Data.md)
- [Filtering](docs/Filtering.md)
- [Rendering](docs/Rendering.md)
- [Public Methods](docs/Methods.md)
- [Props](docs/Props.md)

## CSS
The component tries to use as little CSS as possible, relying primarily on Bootstrap or any Bootstrap themes for styling. Some minimal styling is included in `Typeahead.css` and `Token.css` and should ideally be included wherever you're using the component.

## Example
To modify the example, clone the repository, `npm install` and `npm run example` to build the example index file. You can then open the HTML file locally in a browser. You can also try the [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

## Browser Support
Recent versions of the following browsers are supported:
- Chrome
- Firefox
- IE (10/11)
- Safari

## License
[MIT](https://github.com/ericgio/react-bootstrap-typeahead/blob/master/LICENSE.md)
