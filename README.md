# React Bootstrap Typeahead
React-based typeahead component that uses standard the Bootstrap theme for as a base and supports both single- and multi-selection. Try a [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

[![npm](https://img.shields.io/npm/v/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![npm](https://img.shields.io/npm/dm/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)

Please note that this library is under active development and the APIs may change.

## Installation
Use NPM to install the module in your project and build using a tool like webpack or browserify.

```
npm install react-bootstrap-typeahead
```

Make sure you have the appropriate CSS loaders ([see notes below](#css)).

To generate UMD modules, both minified and unminified, download the project and run `npm run build`.

## Usage
`react-bootstrap-typeahead` works very much like any standard `input` element. It requires an array of options to display, similar to a `select`. 

```
var Typeahead = require('react-bootstrap-typeahead');

<Typeahead
  onChange={this._handleChange}
  options={myData}
/>
```

### Single & Multi-Selection
`react-bootstrap-typeahead` allows single-selection by default, but also supports multi-selection. Simply set the `multiple` prop and the component turns into a tokenizer:

```
<Typeahead
  multiple
  onChange={this._handleChange}
  options={myData}
/>
```

### Controlled vs. Uncontrolled
Like an `input`, the component can be controlled or uncontrolled. Use the `selected` prop to control it via the parent, or `defaultSelected` to optionally set defaults and then allow the component to control itself.

```
<Typeahead
  onChange={this._handleChange}
  options={myData}
  selected={selected}
/>
```

## Data
`react-bootstrap-typeahead` has some expectations about the shape of your data. It expects an array of objects, each of which should have a string property to be used as the label for display. By default, the key is named `label`, but you can specify a different key via the `labelKey` prop.

```
var myData = [
  {id: 1, name: 'John'},
  {id: 2, name: 'Miles'},
  {id: 3, name: 'Charles'},
  {id: 4, name: 'Herbie'},
];

<Typeahead
  labelKey="name"
  onChange={this._handleChange}
  options={myData}
/>
```

As far as the source of the data, the component simply handles rendering and selection. It is agnostic about the data source (eg: an async endpoint), which should be handled separately.

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

## CSS
The component tries to use as little CSS as possible, relying primarily on Bootstrap or any Bootstrap themes for styling. There is a small amount, which is bundled with the JS files.

Browserify users will need to use [browserify-css](https://www.npmjs.com/package/browserify-css) (or something similar) to handle the CSS bundling, while Webpack user will need to use [css-loader](https://www.npmjs.com/package/css-loader) and/or [style-loader](https://www.npmjs.com/package/style-loader) in their webpack config file.

## Example
An example file is included with the NPM module. Simply open `example/index.html` in a browser. If you're using the repository code, you'll need to run `npm run example` to build the example index file. You can then open the HTML file as described above. You can also try the [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

## Documentation

### Props
Name | Type | Default | Description
-----|------|---------|------------
allowNew | boolean | false | Allows the creation of new selections on the fly. Note that any new items will be added to the list of selections, but not the list of original options unless handled as such by `Typeahead`'s parent.
defaultSelected | array | `[]` | Specify any pre-selected options. Use only if you want the component to be uncontrolled.
disabled | boolean | | Whether to disable the input. Will also disable selections when `multiple={true}`.
emptyLabel | string | 'No matches found.' | Message to display in the menu if there are no valid results.
labelKey | string | 'label' | Specify which option key to use for display. By default, the selector will use the `label` key.
maxHeight | number | `300` | Maximum height of the dropdown menu, in px.
multiple | boolean | `false` | Whether or not multiple selections are allowed.
newSelectionPrefix | string | 'New selection:' | Provides the ability to specify a prefix before the user-entered text to indicate that the selection will be new. No-op unless `allowNew={true}`.
onChange | function | | Callback for handling selected values.
onInputChange | function | | Callback for handling changes to the user-input text.
options `required` | array | | Full set of options, including any pre-selected options.
placeholder | string | | Placeholder text for the input.
renderMenuItemChildren | function | | Provides a hook for customized rendering of menu item contents.
selected | array | `[]` | The selected option(s) displayed in the input. Use this prop if you want to control the component via its parent.
