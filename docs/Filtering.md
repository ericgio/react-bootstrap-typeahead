# Filtering
By default, the component will filter results based on a case-insensitive string match between the input string and the `labelKey` property of each option (or the option itself, if an array of strings is passed). You can customize the filtering a few ways:

### `caseSensitive: boolean` (default: `false`)
Setting to `true` changes the string match to be, you guessed it, case-sensitive. Defaults to `false`.
```jsx
<Typeahead
  ...
  caseSensitive
/>
```

### `ignoreDiacritics: boolean` (default: `true`)
By default, the component ignores accents and other diacritical marks when performing string matches. Set this prop to `false` to override that setting and perform a strict match.
```jsx
<Typeahead
  ...
  ignoreDiacritics={false}
/>
```

### `filterBy`
The `filterBy` prop can be used in one of two ways: to specify `option` properties that should be searched or to pass a custom callback.

#### `Array<string>`
By default, the filtering algorithm only searches the field that corresponds to `labelKey`. However, you can pass an array of additional fields to search:
```jsx
<Typeahead
  ...
  filterBy={['firstName', 'lastName', 'email']}
/>
```
The field corresponding to `labelKey` is always searched (once), whether or not you specify it.

#### `(option: Object|string, props: Object) => boolean`
You can also pass your own callback to take complete control over how the filtering works. Note that the `caseSensitive` and `ignoreDiacritics` props will be ignored in this case, since you are now completely overriding the algorithm. 

```jsx
<Typeahead
  ...
  filterBy={(option, props) => {
    /* Your own filtering code goes here. */
  }}
/>
```
You can disable filtering completely by passing a function that returns `true`:

```jsx
<Typeahead
  ...
  filterBy={() => true}
/>
```

[Next: Rendering](Rendering.md)
