# Upgrade Guide

## v2.0
Version 2.0 consists mainly of internal refactoring aimed at reducing parallel code paths and making certain complex feature requests possible. These changes should mostly be transparent, though you may notice that the component behaves a bit differently.

### Breaking Changes
#### `AsyncTypeahead`
The `AsyncTypeahead` component now requires the request state to be managed externally. Use the `isLoading` prop to tell the component if a request is pending or not. See [the example](https://github.com/ericgio/react-bootstrap-typeahead/blob/master/example/examples/AsyncExample.react.js) for an illustration of proper usage.

#### CSS Changes
In an effort to simplify the CSS and as a result of the refactor, class names for the various internal components were changed. This may cause styling to break if you relied on a certain naming scheme. The separate CSS files were also combined into a single file (`Typeahead.css`) to make it easier to include.

### Deprecations
- The `name` prop is now deprecated and will be removed in v3.0. Use `inputProps` to apply props directly to the input instead.

## v1.0
Version 1.0 has a few breaking changes, but upgrading should be relatively painless.

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
