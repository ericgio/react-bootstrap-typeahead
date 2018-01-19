# Rendering
`react-bootstrap-typeahead` is intended to work with standard [Bootstrap](http://getbootstrap.com/) components and styles. It provides basic rendering for your data by default, but also allows for more advanced options should the need arise.

### `labelKey: String|Function`

The `labelKey` prop specifies the string that will be used for searching and rendering options and selections. If set to a string (default), it will use that property of the data option. You can also pass in a function to do something like concatenate multiple data properties.

#### `String` (default: `'label'`)
Passing a string value specifies which property on your data object to use. If you pass an array of strings as your data, `labelKey` is ignored.

#### `Function(option: Object|String)`
Pass in a function to create a custom string without modifying your data. Note: the return value *must* be a string.

```jsx
// Menu items and selections will display, eg: "Elvin Jones".
<Typeahead
  labelKey={option => `${option.firstName} ${option.lastName}`}
  options={[
    {firstName: 'Art', lastName: 'Blakey'},
    {firstName: 'Jimmy', lastName: 'Cobb'},
    {firstName: 'Elvin', lastName: 'Jones'},
    {firstName: 'Max', lastName: 'Roach'},
    {firstName: 'Tony', lastName: 'Williams'},
  ]}
/>
```

### `renderMenu(results: Array<Object|String>, menuProps: Object)`
Provides complete flexibility for rendering the typeahead's menu. `results` are the subset of options after they have been filtered and paginated. `menuProps` are any menu-relevant props passed down from the `Typeahead` component. You can also just set props directly on your `Menu`.

Along with stylistic customization, the `renderMenu` hook also allows you to do things like re-sort or group your data. Note that if you manipulate data in this way, you *must* use either the provided `MenuItem` component or wrap your own menu item components with [`menuItemContainer`](API.md#menuitemcontainer) to ensure proper behavior.

```jsx
<Typeahead
  options={options}
  renderMenu={(results, menuProps) => (
    return (
      <Menu {...menuProps}>
        {results.map((result, index) => (
          <MenuItem option={result} position={index}>
            {result.label}
          </MenuItem>
        ))}
      </Menu>
    );
  )}
/>
```

### `renderMenuItemChildren(result: Object|String, props: Object)`
Allows you to control the contents of a menu item. Your function will be passed the `TypeaheadMenu` props, an individual option from your data list, and the index:

```jsx
<Typeahead
  options={options}
  renderMenuItemChildren={(result, props) => {
    /* Render custom contents here. */
  }}
/>
```

### `renderToken(selectedItem: Object|String, onRemove: Function)`
Provides the ability to customize rendering of tokens when multiple selections are enabled. The first parameter is the current selected option in the loop, while the second parameter is the `onRemove` callback passed down by the main component. This callback is ignored if `multiple=false`.

```jsx
<Typeahead
  ...
  multiple
  renderToken={(selectedItem, onRemove) => {
    /* Render custom token here. */
  }}
/>
```

Be careful when using `renderToken`, since you will need to handle things like disabling the tokens and removing them (via `onRemove`) yourself. It is highly recommended that you use the provided `Token` component. If you want to use a completely custom token, wrap it with the [`tokenContainer`](API.md#tokencontainer) HOC to retain keystroke behaviors.

[Next: Public Methods](Methods.md)
