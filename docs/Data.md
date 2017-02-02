# Data
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
The component simply handles rendering and selection of the data that is passed in. It is agnostic about the data source, which should be handled separately. The [`AsyncTypeahead`](API.md#asynctypeahead) component is provided to help in cases where data is being fetched asynchronously from an endpoint.

[Next: Filtering](Filtering.md)
