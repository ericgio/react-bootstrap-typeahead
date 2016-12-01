# React Bootstrap Typeahead
React-based typeahead component that uses Bootstrap as a base for styles and behaviors and supports both single- and multi-selection. The UI and behaviors are inspired by Twitter's [typeahead.js](https://github.com/twitter/typeahead.js). Try a [live example](http://ericgio.github.io/react-bootstrap-typeahead/).

[![npm version](https://img.shields.io/npm/v/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![npm downloads](https://img.shields.io/npm/dm/react-bootstrap-typeahead.svg?style=flat-square)](https://www.npmjs.com/package/react-bootstrap-typeahead)
[![build status](https://img.shields.io/travis/ericgio/react-bootstrap-typeahead/master.svg?style=flat-square)](https://travis-ci.org/ericgio/react-bootstrap-typeahead)
[![cdnjs](https://img.shields.io/cdnjs/v/react-bootstrap-typeahead.svg?style=flat-square)](https://cdnjs.com/libraries/react-bootstrap-typeahead)

Please note that this library is under active development and the APIs may change. The documentation below applies to the most recent version and may no longer be applicable if you're using an outdated version.

## v1.0.0 (beta)
A pre-release of v1.0 is now available. This version has some breaking changes; please see the [release notes](https://github.com/ericgio/react-bootstrap-typeahead/releases/tag/v1.0.0-beta1) for more information. The code is reasonably stable, but could use some additional real-world testing. New examples and better documentation are currently the main things gating a full release.

The latest stable version is v0.10.4

## Contents
- [Installation](#installation)
- [Importing vs. Requiring](#importing-vs-requiring)
- [Usage](#usage)
- [Data](#data)
- [Filtering](#filtering)
- [Custom Rendering](#custom-rendering)
- [Public Methods](#public-methods)
- [Props](#props)
- [CSS](#css)
- [Example](#example)
- [Browser Support](#browser-support)
- [License](#license)

## Installation
Use NPM to install the module in your project:
```
npm install --save react-bootstrap-typeahead
```
Minified and unminified UMD modules are also included in the NPM package, or you can clone the project and `npm run build` to generate these files.

## Importing vs. Requiring
The component is written using ES6 modules and transpiled with [Babel 6](http://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/). If you are also using ES6, you can simply `import` just as you would any other module:
```jsx
import Typeahead from 'react-bootstrap-typeahead';
```
If you're using CommonJS, you'll need to explicitly specify `default`:
```jsx
var Typeahead = require('react-bootstrap-typeahead').default;
```
Alternatively, you can use the [`add-module-exports`](https://www.npmjs.com/package/babel-plugin-add-module-exports) Babel plugin to avoid having to add `.default`.

## Usage
The component behaves similar to other form elements. It requires an array of options to be displayed, similar to a `select`.
```jsx
<Typeahead
  onChange={this._handleChange}
  options={myData}
/>
```

### Single & Multi-Selection
The component provides single-selection by default, but also supports multi-selection. Simply set the `multiple` prop and the component turns into a tokenizer:

```jsx
<Typeahead
  multiple
  onChange={this._handleChange}
  options={myData}
/>
```

### Controlled vs. Uncontrolled
Like an `input`, the component can be [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) or [uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components). Use the `selected` prop to control it via the parent, or `defaultSelected` to optionally set defaults and then allow the component to control itself.

```jsx
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

```jsx
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

## Filtering
By default, the component will filter results based on a case-insensitive string match between the input string and the `labelKey` property of each option (or the option itself, if an array of strings is passed). You can customize the filtering a few ways:

### `caseSensitive` prop
Setting this prop to `true` changes the string match to be, you guessed it, case-sensitive. Defaults to `false`.
```jsx
<Typeahead
  ...
  caseSensitive
/>
```

### `filterBy` prop
The `filterBy` prop can be used in one of two ways: to specify `option` properties that should be searched or to pass a completely custom callback.

#### Specify fields to search
By default, the filtering algorithm only searches the field that corresponds to `labelKey`. However, you can pass an array of additional fields to search:
```jsx
<Typeahead
  ...
  filterBy={['firstName', 'lastName', 'email']}
/>
```
The field corresponding to `labelKey` is always searched (once), whether or not you specify it.

#### Custom callback
You can also pass your own callback to take complete control over how the filtering works. Note that the `caseSensitive` prop will no longer work in this case, since you are now completely overriding the algorithm.
```jsx
<Typeahead
  ...
  filterBy={option => {
    /* Your own filtering code goes here. */
  }}
/>
```

## Custom Rendering
`react-bootstrap-typeahead` is intended to work with standard [Bootstrap](http://getbootstrap.com/) components and styles. It provides basic rendering for your data by default, but also allows for more advanced options should the need arise.


### `labelKey`

Allows you to control the contents of the selection.  If set to a string, will use that property of the selected option.  It can also be set to a function, with one argument (the selected option) and returning a string for rendering.
```jsx
<Typeahead
  options={options}
  labelKey={(option) => {
    /* Return custom contents here. */
  }}
/>
```
### `renderMenuItemChildren`
Allows you to control the contents of a menu item. Your function will be passed the `TypeaheadMenu` props, an individual option from your data list, and the index:
```jsx
<Typeahead
  options={options}
  renderMenuItemChildren={(props, option, idx) => {
    /* Render custom contents here. */
  }}
/>
```

### `renderToken`
Provides the ability to customize rendering of tokens when multiple selections are enabled. The first parameter is the current selected option in the loop, while the second parameter is the `onRemove` callback passed down by the main component. This callback is a no-op if `multiple` is false.

```jsx
<Typeahead
  ...
  multiple
  renderToken={(option, onRemove) => {
    /* Render custom token here. */
  }}
/>
```

Be careful when using `renderToken`, since you will need to handle things like disabling the tokens and removing them (via `onRemove`) yourself. It is highly recommended that you use the provided `Token` component:

```jsx
// ES2015
import Token from 'react-bootstrap-typeahead/lib/Token.react';

// CommonJS
const Token = require('react-bootstrap-typeahead/lib/Token.react');
```

Note that if you use your own component to render the token, you will lose built-in functionality like removing via keystroke.

## Public Methods
To access the component's public methods, add a ref to your typeahead instance:
```jsx
<Typeahead ref="typeahead" ... />
```
then access the ref from your handler:
```jsx
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
bsSize | one of: `'large'`, `'lg'`, `'small'`, `'sm'` | | Specify the size of the input.
caseSensitive | bool | false | Whether or not filtering should be case-sensitive.
defaultSelected | array | `[]` | Specify any pre-selected options. Use only if you want the component to be uncontrolled.
disabled | boolean | | Whether to disable the input. Will also disable selections when `multiple={true}`.
dropup | boolean | false | Specify whether the menu should appear above the input.
emptyLabel | string | 'No matches found.' | Message to display in the menu if there are no valid results.
filterBy | function or array | `[]` | Either an array of fields in `option` to search, or a custom filtering callback.
labelKey | string or function | 'label' | Specify which option key to use for display or a render function. By default, the selector will use the `label` key.
maxHeight | number | `300` | Maximum height of the dropdown menu, in px.
maxResults | number | `100` | Maximum number of results to display by default. Mostly done for performance reasons so as not to render too many DOM nodes in the case of large data sets.
minLength | number | `0` | Number of input characters that must be entered before showing results.
multiple | boolean | `false` | Whether or not multiple selections are allowed.
name | string | | Name property for the input
newSelectionPrefix | string | 'New selection:' | Provides the ability to specify a prefix before the user-entered text to indicate that the selection will be new. No-op unless `allowNew={true}`.
onBlur | function | | Callback fired when the input is blurred. Receives an event.
onChange | function | | Callback fired whenever items are added or removed. Receives an array of the selected options.
onFocus | function | | Callback fired when the input is focused. Receives an event.
onInputChange | function | | Callback fired when user-input text changes. Receives the text string.
options `required` | array | | Full set of options, including any pre-selected options.
paginate | boolean | `true` | Give user the ability to display additional results if the number of results exceeds `maxResults`.
paginateResults | number | 100 | DEPRECATED. Use `maxResults` and `paginate` instead.
paginationText | string | 'Display additional results...' | Prompt displayed when large data sets are paginated.
placeholder | string | | Placeholder text for the input.
renderMenuItemChildren | function | | Provides a hook for customized rendering of menu item contents.
renderToken | function | | Provides a hook for customized rendering of tokens when multiple selections are enabled.
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
