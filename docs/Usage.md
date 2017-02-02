# Basic Usage
The typeahead behaves similarly to other form elements. It requires an array of data options to be filtered and displayed.
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
// Controlled
<Typeahead
  onChange={this._handleChange}
  options={myData}
  selected={selected}
/>

// Uncontrolled
<Typeahead
  defaultSelected={selected}
  onChange={this._handleChange}
  options={myData}
/>
```

[Next: Data](Data.md)
