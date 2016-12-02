# Public Methods
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
