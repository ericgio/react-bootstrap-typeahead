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

### `renderInput(inputProps: Object, state: Object)`
Provides flexibility for rendering the typeahead's input. `inputProps` are any input-relevant props passed down from the `Typeahead` component. You can also just set props directly on your `input`.

```jsx
<Typeahead
  options={options}
  renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
    <CustomInput
      {...inputProps}
      ref={(input) => {
        // Be sure to correctly handle these refs. In many cases, both can simply receive
        // the underlying input node, but `referenceElementRef can receive a wrapper node if
        // your custom input is more complex (See TypeaheadInputMulti for an example).
        inputRef(input);
        referenceElementRef(input);
      }}
    />
  )}
/>
```

#### `renderInput` gotchas
- Your input component must correctly apply the `inputRef` and `referenceElementRef` properties passed to `renderInput` (see example code above). Both are callback refs that expect DOM elements. `inputRef` is used internally to control aspects of the component like blur and focus states, and must receive the `input` node from your component. `referenceElementRef` is used by popper.js to position the menu and in many cases is also simply the input node itself. In case of a more complex input (eg: multi-select/tokenizer), the reference element may be a container element, hence the need for separate refs.
- To take advantage of hinting functionality, use the `Hint` component. Alternatively, you can use the `useHint` hook and apply your own hint markup.

### `renderMenu(results: Array<Object|String>, menuProps: Object, state: Object)`
Provides flexibility for rendering the typeahead's menu. `results` are the subset of options after they have been filtered and paginated. `menuProps` are any menu-relevant props passed down from the `Typeahead` component. You can also just set props directly on your `Menu`.

Along with stylistic customization, the `renderMenu` hook allows you to do things like re-sort or group your data. Note that if you manipulate data in this way, you *must* use either the provided `MenuItem` component or the [appropriate hook or HOC](API.md#useitem--withitem) to ensure proper behavior.

```jsx
<Typeahead
  options={options}
  renderMenu={(results, menuProps) => (
    <Menu {...menuProps}>
      {results.map((result, index) => (
        <MenuItem option={result} position={index}>
          {result.label}
        </MenuItem>
      ))}
    </Menu>
  )}
/>
```

#### `renderMenu` gotchas
- It is highly recommended that you use the `Menu` component included with the package. If you choose to use your own component, you will need to properly consume the `innerRef` prop passed down as part of `menuProps` or your menu will not be properly positioned.
- If you want to allow custom options or pagination, you will need to render these menu items yourself. If present, they should be the last two items in the `results` array. See the [TypeaheadMenu](https://github.com/ericgio/react-bootstrap-typeahead/blob/master/src/components/TypeaheadMenu.js) component for an example of how to handle rendering.

### `renderMenuItemChildren(option: Object|String, props: Object, index: Number)`
Allows you to control the contents of a menu item. Your function will be passed an item from your `options` array, the `TypeaheadMenu` props, and the item's index within the array:

```jsx
<Typeahead
  options={options}
  renderMenuItemChildren={(option, props, index) => {
    /* Render custom contents here. */
  }}
/>
```

### `renderToken(option: Object|String, props: Object, index: Number)`
Provides the ability to customize rendering of tokens when multiple selections are enabled. This callback is ignored if `multiple=false`.

```jsx
<Typeahead
  ...
  multiple
  renderToken={(option, props, index) => {
    /* Render custom token here. */
  }}
/>
```

Be careful when using `renderToken`, since you will need to handle things like disabling the tokens and removing them (via `props.onRemove`) yourself. It is highly recommended that you use the provided `Token` component. If you want to use a completely custom token, use either the provided [hook or HOC](API.md#usetoken--withtoken) to retain keystroke behaviors.

[Next: Public Methods](Methods.md)
