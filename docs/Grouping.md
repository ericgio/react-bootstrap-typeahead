# Grouping

By default, the component will render all options in the same level. You can group the options by suppling `groupBy`:

### `groupBy: string|Function`

#### `string:`

If this property is a string, it must be a propery present in each option.

```jsx
const options = [
  { name: 'Alabama', region: 'South' },
  { name: 'Alaska', region: 'West' },
  { name: 'Arizona', region: 'West' },
  { name: 'Arkansas', region: 'South' },
  ...
];

<Typeahead
  ...
  options={options}
  labelBy="name"
  groupBy="region"
/>
```

#### `Function`

`groupBy` also supports a function for custom grouping:

```jsx
const options = [
  { name: 'Alabama', population: 4780127 },
  { name: 'Alaska', population: 710249 },
  { name: 'Arizona', population: 6392307 },
  { name: 'Arkansas', population: 2915958 },
  ...
];

const groupFn = (options) => {
  const sm = [];
  const md = [];
  const lg = [];

  options.forEach(option => {
    if(option.population < 1000000) {
      sm.push(option);
    } else if (option.population < 10000000) {
      md.push(option);
    } else {
      lg.push(option);
    }
  });

  return {
    'Small (< 1 mi)': sm,
    'Medium (< 10 mi)': md,
    'Large (+10 mi)': lg
  };
}

<Typeahead
  ...
  options={options}
  labelBy="name"
  groupBy={groupFn}
/>
```

[Next: Rendering](Rendering.md)
