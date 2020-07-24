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

Name | Description
---- | -----------
`blur()` | Blurs the input.
`clear()` | Resets the typeahead component. Clears both text and selection(s).
`focus()` | Focuses the input.
`getInput()` | Provides access to the component's input node.
`hideMenu()` | Hides the menu.
`toggleMenu()` | Shows the menu if it is currently hidden; hides the menu if it is currently shown.

[Next: API](API.md)
