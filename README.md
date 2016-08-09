# React Bootstrap Typeahead
React-based typeahead component that uses Bootstrap as a base for styles and behaviors and supports both single- and multi-selection. The UI and behaviors are inspired by Twitter's [typeahead.js](https://github.com/twitter/typeahead.js). Try a [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

[![build status](https://img.shields.io/travis/ericgio/react-bootstrap-typeahead/master.svg?style=flat-square)](https://travis-ci.org/ericgio/react-bootstrap-typeahead)
[![npm version](https://img.shields.io/npm/v/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![npm downloads](https://img.shields.io/npm/dm/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)

Please note that this library is under active development and the APIs may change. The documentation below applies to the most recent version and may no longer be applicable if you're using an outdated version.

## Installation
Use NPM to install the module in your project:
```
npm install --save react-bootstrap-typeahead
```
Minified and unminified UMD modules are also included in the NPM package, or you can clone the project and `npm run build` to generate these files.

## Importing vs. Requiring
The component is written using ES6 modules and transpiled with [Babel 6](http://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/). If you are also using ES6, you can simply `import` just as you would any other module:
```
import Typeahead from 'react-bootstrap-typeahead';
```
If you're using CommonJS, you'll need to explicitly specify `default`:
```
var Typeahead = require('react-bootstrap-typeahead').default;
```
Alternatively, you can use the [`add-module-exports`](https://www.npmjs.com/package/babel-plugin-add-module-exports) Babel plugin to avoid having to add `.default`.

## Usage
The component behaves similar to other form elements. It requires an array of options to be displayed, similar to a `select`.
```
<Typeahead
  onChange={this._handleChange}
  options={myData}
/>
```

### Single & Multi-Selection
The component provides single-selection by default, but also supports multi-selection. Simply set the `multiple` prop and the component turns into a tokenizer:

```
<Typeahead
  multiple
  onChange={this._handleChange}
  options={myData}
/>
```

### Controlled vs. Uncontrolled
Like an `input`, the component can be [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) or [uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components). Use the `selected` prop to control it via the parent, or `defaultSelected` to optionally set defaults and then allow the component to control itself.

```
<Typeahead
  onChange={this._handleChange}
  options={myData}
  selected={selected}
/>
```

## Data
`react-bootstrap-typeahead` accepts an array of either strings or objects. If you pass in objects, each one should have a string property to be used as the label for display. By default, the key is named `label`, but you can specify a different key via the `labelKey` prop. If you pass an array of strings, the `labelKey` prop will be ignored.

The component will throw an error if any options are something other than a string or object with a valid `labelKey`.

The following are valid data structures:

```
// Array of strings.
var myData = [
  'John',
  'Miles',
  'Charles',
  'Herbie',
];

// Array of objects with default `labelKey`.
var myData = [
  {id: 1, label: 'John'},
  {id: 2, label: 'Miles'},
  {id: 3, label: 'Charles'},
  {id: 4, label: 'Herbie'},
];

// Array of objects with custom `labelKey`.
// The `labelKey` prop must be set to 'name' in this case.
var myData = [
  {id: 1, name: 'John'},
  {id: 2, name: 'Miles'},
  {id: 3, name: 'Charles'},
  {id: 4, name: 'Herbie'},
];

// Mixed array of strings and objects.
// Note: while valid, this is NOT recommended.
var myData = [
  'John',
  'Miles',
  {id: 3, label: 'Charles'},
  'Herbie',
];
```

### Duplicate Data
You may have unexpected results if your data contains duplicate options. For this reason, it is highly recommended that you pass in objects with unique identifiers (eg: an id) if possible.

### Data Sources
The component simply handles rendering and selection of the data that is passed in. It is agnostic about the data source (eg: an async endpoint), which should be handled separately.

## Rendering
`react-bootstrap-typeahead` is intended to work with standard [Bootstrap](http://getbootstrap.com/) components and styles. It provides basic rendering for your data by default, but also allows for more advanced options should the need arise.

### `renderMenuItemChildren`
Allows you to control the contents of a menu item. Your function will be passed the `TypeaheadMenu` props, an individual option from your data list, and the index:
```
<Typeahead
  options={options}
  renderMenuItemChildren={(props, option, idx) => {
    /* Render custom contents here */
  }}
/>
```

## Public Methods
To access the component's public methods, add a ref to your typeahead instance:
```
<Typeahead ref="typeahead" ... />
```
then access the ref from your handler:
```
<button onClick={() => this.refs.typeahead.getInstance().clear()}>
  Clear Typeahead
</button>
```

Note that you *must* use `getInstance` to get the typeahead instance. This is because `react-bootstrap-typeahead` is wrapped by the [`react-onclickoutside`](https://github.com/Pomax/react-onclickoutside) higher-order component, so the `clear` method is not directly available. See [`react-onclickoutside`'s documentation](https://github.com/Pomax/react-onclickoutside#but-how-can-i-access-my-component-it-has-an-api-that-i-rely-on) for more information.

### `blur()`
Provides a programmatic way to blur the input.

### `clear()`
Provides a programmatic way to reset the input. Calling the method will clear both text and selection(s).

### `focus()`
Provides a programmatic way to focus the input.

## Props
Name | Type | Default | Description
-----|------|---------|------------
align | string | 'justify' | Specify menu alignment. The default value is `justify`, which makes the menu as wide as the input and truncates long values. Specifying `left` or `right` will align the menu to that side and the width will be determined by the length of menu item values.
allowNew | boolean | false | Allows the creation of new selections on the fly. Any new items will be added to the list of selections, but not the list of original options unless handled as such by `Typeahead`'s parent. The newly added item will *always* be returned as an object even if the other options are simply strings, so be sure your `onChange` callback can handle this.
defaultSelected | array | `[]` | Specify any pre-selected options. Use only if you want the component to be uncontrolled.
disabled | boolean | | Whether to disable the input. Will also disable selections when `multiple={true}`.
emptyLabel | string | 'No matches found.' | Message to display in the menu if there are no valid results.
labelKey | string | 'label' | Specify which option key to use for display. By default, the selector will use the `label` key.
maxHeight | number | `300` | Maximum height of the dropdown menu, in px.
maxResults | number | `100` | Maximum number of results to display by default. Mostly done for performance reasons so as not to render too many DOM nodes in the case of large data sets.
minLength | number | `0` | Number of input characters that must be entered before showing results.
multiple | boolean | `false` | Whether or not multiple selections are allowed.
name | string | | Name property for the input
newSelectionPrefix | string | 'New selection:' | Provides the ability to specify a prefix before the user-entered text to indicate that the selection will be new. No-op unless `allowNew={true}`.
onBlur | function | | Callback fired when the input is blurred. Receives an event.
onChange | function | | Callback fired whenever items are added or removed. Receives an array of the selected options.
onInputChange | function | | Callback fired when user-input text changes. Receives the text string.
options `required` | array | | Full set of options, including any pre-selected options.
paginate | boolean | `true` | Give user the ability to display additional results if the number of results exceeds `maxResults`.
paginateResults | number | 100 | DEPRECATED. Use `maxResults` and `paginate` instead.
paginationText | string | 'Display additional results...' | Prompt displayed when large data sets are paginated.
placeholder | string | | Placeholder text for the input.
renderMenuItemChildren | function | | Provides a hook for customized rendering of menu item contents.
selected | array | `[]` | The selected option(s) displayed in the input. Use this prop if you want to control the component via its parent.

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
