# Public Methods
To access the component's public methods, pass a ref to your typeahead then access the ref in your code:
```jsx
const ref = React.createRef();

<>
  <Typeahead
    ...
    ref={ref}
  />
  <button onClick={() => ref.current.clear()}>
    Clear Typeahead
  </button>
</>
```

### `blur()`
Provides a imperative way to blur the input.

### `clear()`
Provides a imperative way to reset the component. Calling the method will clear both text and selection(s).

### `focus()`
Provides a imperative way to focus the input.

### `getInput()`
Provides access to the component's input node.

[Next: Props](Props.md)
