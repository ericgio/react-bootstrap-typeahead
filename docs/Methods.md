# Public Methods
To access the component's public methods, add a ref to your typeahead instance and access the ref from a given handler:
```jsx
<div>
  <Typeahead
    ...
    ref={(typeahead) => this.typeahead = typeahead}
  />
  <button onClick={() => this.typeahead.getInstance().clear()}>
    Clear Typeahead
  </button>
</div>
```

Note that you *must* use `getInstance` to get the typeahead instance. This is because `react-bootstrap-typeahead` is wrapped by the [`react-onclickoutside`](https://github.com/Pomax/react-onclickoutside) higher-order component, so the `clear` method is not directly available. See [`react-onclickoutside`'s documentation](https://github.com/Pomax/react-onclickoutside#but-how-can-i-access-my-component-it-has-an-api-that-i-rely-on) for more information.

### `blur()`
Provides a programmatic way to blur the input.

### `clear()`
Provides a programmatic way to reset the input. Calling the method will clear both text and selection(s).

**Warning: Be careful when calling this method from the `onChange` handler**. Doing so can cause an infinite loop since `clear` triggers the change event. If you want to clear the typeahead after a selection, be sure to check the length of the selections:

```jsx
onChange = (selected) => {
  ...
  if (selected.length) {
    this.typeahead.getInstance().clear();
  }
}
```

### `focus()`
Provides a programmatic way to focus the input.

[Next: Props](Props.md)
