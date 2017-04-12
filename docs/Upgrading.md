# v1.x Upgrade Guide
Version 1.x has a few breaking changes, but upgrading should be relatively painless.

### Importing
The main change affecting all users is that the typeahead is now a property of the module:

```jsx
// v0.10.x
import Typeahead from 'react-bootstrap-typeahead'; // ES2015
var Typeahead = require('react-bootstrap-typeahead').default; // CommonJS

// v1.x
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
var Typeahead = require('react-bootstrap-typeahead').Typeahead; // CommonJS
```

### `paginateResults`
This prop was deprecated in v0.9.0 and is now gone.

### `renderMenuItemChildren`
The signature for the `renderMenuItemChildren` callback was changed such that the data item is now the first argument and props are second. This felt more logical and [all such `render` functions](Rendering.md#rendermenu) follow a similar pattern.

```jsx
// v0.10.x
renderMenuItemChildren(props, result, index) {
  // Rendering code here...
}

// v1.x
renderMenuItemChildren(result, props, index) {
  // Rendering code here...
}
```

That should be everything. If you come across something I missed, please open an issue. Thanks!

[Next: Basic Usage](Usage.md)
