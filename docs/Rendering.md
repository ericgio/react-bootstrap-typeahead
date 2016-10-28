# Rendering
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

### `renderMenu`
Provides full control over how the menu is rendered. Use the `MenuItem` component provided with the module to ensure the proper behaviors. You will need to pass the data and menu position for each item.
```jsx
<Typeahead
  options={options}
  renderMenu={(results, menuProps) => (
    return (
      <Menu {...menuProps}>
        {results.map((result, idx) => (
          <MenuItem option={result} position={idx}>
            {result.label}
          </MenuItem>
        ))}
      </Menu>
    );
  )}
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

[Next: Public Methods](Methods.md)
