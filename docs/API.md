# API Reference
The components and higher-order components (HOCs) described below are publicly exposed in the top-level module. Other components should be considered private and subject to change without notice.

#### [Components](#components-1)
- [`<Typeahead>`](#typeahead)
- [`<AsyncTypeahead>`](#asynctypeahead)
- [`<Highlighter>`](#highlighter)
- [`<Hint>`](#hint)
- [`<Input>`](#input)
- [`<Menu>`](#menu)
- [`<MenuItem>`](#menuitem)
- [`<TypeaheadInputSingle>` & `<TypeaheadInputMulti>`](#typeaheadinputsingle--typeaheadinputmulti)
- [`<TypeaheadMenu>`](#typeaheadmenu)
- [`<Token>`](#token)

#### [Higher-Order Components & Hooks](#higher-order-components--hooks-1)
- [`useAsync` & `withAsync`](#useasync--withasync)
- [`useItem` & `withItem`](#useitem--withitem)
- [`useToken` & `withToken`](#usetoken--withtoken)
- [`useHint`](#useHint)

## Components

### `<Typeahead>`
The primary component provided by the module.

#### Props
Name | Type | Default | Description
-----|------|---------|------------
align | `'justify'` \| `'left'` \| `'right'` | `'justify'` | Specify menu alignment. The default value is `justify`, which makes the menu as wide as the input and truncates long values. Specifying `left` or `right` will align the menu to that side and the width will be determined by the length of menu item values.
allowNew | boolean \| function | `false` | Specifies whether or not arbitrary, user-defined options may be added to the result set. New entries will be included when the trimmed input is truthy and there is no exact match in the result set.<br><br>If a function is specified, allows for a callback to decide whether the new entry menu item should be included in the results list. The callback should return a boolean value:<br><br><pre>`(results: Array<Object\|string>, props: Object) => boolean`</pre>
autoFocus | boolean | `false` | Autofocus the input when the component initially mounts.
caseSensitive | boolean | `false` | Whether or not filtering should be case-sensitive.
clearButton | boolean | `false` | Displays a button to clear the input when there are selections.
defaultInputValue | string | `''` | The initial value displayed in the text input.
defaultOpen | boolean | `false` | Whether or not the menu is displayed upon initial render.
defaultSelected | Array\<Object\|string\> | `[]` | Specify any pre-selected options. Use only if you want the component to be uncontrolled.
disabled | boolean | | Whether to disable the input. Will also disable selections when `multiple={true}`.
dropup | boolean | `false` | Specify whether the menu should appear above the input.
emptyLabel | node | `'No matches found.'` | Message displayed in the menu when there are no valid results.
filterBy | Array\<string\> \| function | | See full documentation in the [Filtering section](Filtering.md#filterby-arraystring--function).
flip | boolean | false | Whether or not to automatically adjust the position of the menu when it reaches the viewport boundaries.
highlightOnlyResult | boolean | false | Highlights the menu item if there is only one result and allows selecting that item by hitting enter. Does not work with `allowNew`.
id `required` | string or number | | An html id attribute, required for assistive technologies such as screen readers.
ignoreDiacritics | boolean | true | Whether the filter should ignore accents and other diacritical marks.
inputProps | object | {} | Props to be applied directly to the input. `onBlur`, `onChange`, `onFocus`, and `onKeyDown` are ignored.
isInvalid | boolean | false | Adds the `is-invalid` classname to the `form-control`. Only affects Bootstrap 4.
isLoading | boolean | false | Indicate whether an asynchronous data fetch is happening.
isValid | boolean | false | Adds the `is-valid` classname to the `form-control`. Only affects Bootstrap 4.
labelKey | string \| function | `'label'` | See full documentation in the [Rendering section](Rendering.md#labelkey-string--function).
minLength | number | 0 | Minimum user input before displaying results.
onChange | function | | Invoked when the set of selections changes (ie: an item is added or removed). For consistency, `selected` is always an array of selections, even if multi-selection is not enabled. <br><br><pre>`(selected: Array<Object\|string>) => void`</pre>
onInputChange | function | | Invoked when the input value changes. Receives the string value of the input (`text`), as well as the original event. <br><br><pre>`(text: string, event: Event) => void`</pre>
onBlur, onFocus, onKeyDown | function | | As with a normal text input, these are called when the typeahead input has blur, focus, or keydown events. <br><br><pre>`(event: Event) => void`</pre>
onMenuToggle | function | | Invoked when menu visibility changes. <br><br><pre>`(isOpen: boolean) => void`</pre>
onPaginate | `function` | | Invoked when the pagination menu item is clicked. Receives an event as the first argument and the number of shown results as the second. <br><br><pre>`(event: Event, shownResults: number) => void`</pre>
open | boolean | | Whether or not the menu should be displayed. `undefined` allows the component to control visibility, while `true` and `false` show and hide the menu, respectively.
options `required` | Array\<Object\|string\> | | Full set of options, including any pre-selected options.
paginate | boolean | `true` | Give user the ability to display additional results if the number of results exceeds `maxResults`.
paginationText | string | `'Display additional results...'` | Prompt displayed when large data sets are paginated.
placeholder | string | | Placeholder text for the input.
positionFixed | boolean | `false` | Whether to use fixed positioning for the menu, which is useful when rendering inside a container with `overflow: hidden;`. Uses absolute positioning by default.
renderInput | function | | Callback for custom input rendering. See full documentation in the [Rendering section](Rendering.md#renderinputinputprops-object-state-object).
renderMenu | function | | Callback for custom menu rendering. See full documentation in the [Rendering section](Rendering.md#rendermenuresults-arrayobjectstring-menuprops-object-state-object).
renderMenuItemChildren | function | | Callback for customized rendering of menu item contents. See full documentation in the [Rendering section](Rendering.md#rendermenuitemchildrenoption-objectstring-props-object-index-number).
renderToken | function | | Callback for custom token rendering. See full documentation in the [Rendering section](Rendering.md#rendertokenoption-objectstring-props-object-index-number).
selected | Array\<Object\|string\> | `[]` | The selected option(s) displayed in the input. Use this prop if you want to control the component via its parent.
selectHint | function | | Callback function that determines whether the hint should be selected.<br><br><pre>`(shouldSelectHint: boolean, KeyboardEvent<HTMLInputElement>) => boolean`</pre>
size | `'lg'` \| `'sm'` | | Specify the size of the input.

#### Children
In addition to the props listed above, `Typeahead` also accepts either children or a child render function.

```jsx
<Typeahead ... >
  <div>Render me!</div>
</Typeahead>
```
The render function receives partial internal state from the component:
```jsx
<Typeahead ... >
  {(state) => (
    <div>Render me!</div>
  )}
</Typeahead>
```
This may be useful for things like customizing the loading indicator or clear button, or including an announcer for accessibility purposes.

### `<AsyncTypeahead>`
An enhanced version of the normal `Typeahead` component for use when performing asynchronous searches. Provides debouncing of user input, optional query caching, and search prompt, empty results, and pending request behaviors.

```jsx
<AsyncTypeahead
  isLoading={this.state.isLoading}
  labelKey={option => `${option.login}`}
  onSearch={(query) => {
    this.setState({isLoading: true});
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(resp => resp.json())
      .then(json => this.setState({
        isLoading: false,
        options: json.items,
      }));
  }}
  options={this.state.options}
/>
```

Note that this component is the same as:
```jsx
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';

const AsyncTypeahead = withAsync(Typeahead);
```

#### Props
Name | Type | Default | Description
-----|------|---------|------------
delay | number | `200` | Delay, in milliseconds, before performing search.
isLoading `required` | boolean | | Whether or not an asynchronous request is in progress.
onSearch `required` | function | | Callback to perform when the search is executed, where `query` is the input string.<br><br><pre>`(query: string) => void`</pre>
options | Array\<Object\|string\> | `[]` | Options to be passed to the typeahead. Will typically be the query results, but can also be initial default options.
promptText | node | `'Type to search...'` | Message displayed in the menu when there is no user input.
searchText | node | `'Searching...'` | Message to display in the menu while the request is pending.
useCache | bool | `true` | Whether or not the component should cache query results.

### `<Highlighter>`
Component for highlighting substring matches in the menu items.

```jsx
<Typeahead
  ...
  renderMenuItemChildren={(option, props, idx) => (
    <Highlighter search={props.text}>
      {option[props.labelKey]}
    </Highlighter>
  )}
/>
```

#### Props
Name | Type | Default | Description
-----|------|---------|------------
children `(required)` | string | | `Highlighter` expects a string as the only child.
highlightClassName | string | `'rbt-highlight-text'` | Classname applied to the highlighted text.
search `(required)` | string | | The substring to look for. This value should correspond to the input text of the typeahead and can be obtained via the `onInputChange` prop or from the `text` property of props being passed down via `renderMenu` or `renderMenuItemChildren`.

### `<Hint>`
The `Hint` component can be used to wrap custom inputs.

```jsx
<Typeahead
  ...
  renderInput={({ inputRef, referenceElementRef ...inputProps }) => (
    <Hint>
      <FloatingLabel controlId="name" label="Name">
        <Form.Control
          {...inputProps}
          ref={(node) => {
            inputRef(node);
            referenceElementRef(node);
          }}
          type="text"
        />
      </FloatingLabel>
    </Hint>
  )}
/>
```

#### Props
Name | Type | Default | Description
-----|------|---------|------------
children `(required)` | node | |

### `<Input>`
Abstract `<input>` component that handles an `inputRef` prop and is used as the basis for both single- and multi-select input components.

### `<Menu>`
Provides the markup for a Bootstrap menu, along with some extra functionality for specifying a label when there are no results.

Name | Type | Default | Description
-----|------|---------|------------
emptyLabel | node | `'No matches found.'` | Message to display in the menu if there are no valid results.
id `required` | string \| number | | Id value required for accessibility.
maxHeight | string | `'300px'` | Maximum height of the dropdown menu.

### `<MenuItem>`
Provides the markup for a Bootstrap menu item, but is wrapped by the [`withItem` HOC](#useitem--withitem) to ensure proper behavior within the typeahead context. Provided for use if a more customized `Menu` is desired.

#### Props
Name | Type | Default | Description
-----|------|---------|------------
option `(required)` | Object \| string | | The data item to be displayed.
position | number | | The position of the item as rendered in the menu. Allows the top-level `Typeahead` component to be be aware of the item's position despite any custom ordering or grouping in `renderMenu`. **Note:** The value must be a unique, zero-based, sequential integer for proper behavior when keying through the menu.

### `<TypeaheadInputSingle>` & `<TypeaheadInputMulti>`
Input components that handles single- and multi-selections, respectively. In the multi-select component, selections are rendered as children.

#### Props
Name | Type | Default | Description
-----|------|---------|------------
disabled | boolean | `false` | Whether or not the input component is disabled.

### `<TypeaheadMenu>`
The default menu which is rendered by the `Typeahead` component. Can be used in a custom `renderMenu` function for wrapping or modifying the props passed to it without having to re-implement the default functionality.

#### Props
Name | Type | Default | Description
-----|------|---------|------------
labelKey `required` | string \| function | | See full documentation in the [Rendering section](Rendering.md#labelkey-string--function).
newSelectionPrefix | string | `'New selection: '` | Provides the ability to specify a prefix before the user-entered text to indicate that the selection will be new. No-op unless `allowNew={true}`.
paginationText | string | `'Display additional results...'` | Prompt displayed when large data sets are paginated.
renderMenuItemChildren | function | | Provides a hook for customized rendering of menu item contents.
text `required` | string | | The current value of the typeahead's input.

### `<Token>`
Individual token component, most commonly for use within `renderToken` to customize the `Token` contents.

#### Props
Name | Type | Default | Description
-----|------|---------|------------
option `(required)` | Object \| string | | The data item to be displayed.
disabled | boolean | `false` | Whether the token is in a disabled state. If `true` it will not be interactive or removeable.
href | string | | If provided, the token will be rendered with an `<a>` tag and `href` attribute.
readOnly | boolean | `false` | Whether the token is in a read-only state. If `true` it will not be removeable, but it will be interactive if provided an `href`.
tabIndex | number | `0` | Allows the tabindex to be set if something other than the default is desired.

## Higher-Order Components & Hooks

### `useAsync` & `withAsync`
The HOC used in [`AsyncTypeahead`](#asynctypeahead).

### `useItem` & `withItem`
Connects individual menu items with the main typeahead component via context and abstracts a lot of complex functionality required for behaviors like keying through the menu and input hinting. Also provides `onClick` behavior and active state.

If you use your own menu item components (in `renderMenu` for example), you are strongly advised to use either the hook or the HOC:

```jsx
import { MenuItem } from 'react-bootstrap';
import { Menu, Typeahead, useItem, withItem } from 'react-bootstrap-typeahead';

const Item = withItem(MenuItem);

// OR

const Item = (props) => <MenuItem {...useItem(props)} />;

<Typeahead
  renderMenu={(results, menuProps) => (
    <Menu {...menuProps}>
      {results.map((option, position) => (
        <Item option={option} position={position}>
          {option.label}
        </Item>
      ))}
    </Menu>
  )}
/>
```

### `useToken` & `withToken`
Encapsulates keystroke and outside click behaviors used in `Token`. Useful if you want completely custom markup for the token. The hook and the HOC provide the following props to be consumed by the token component:

Name | Type | Description
-----|------|------------
active | boolean | Whether the token is active or not. Useful for adding an "active" classname to the component for styling.
onBlur | function | Callback invoked when the token loses focus. Should be applied to the top-level element.
onClick | function | Callback invoked when the token is clicked. Should be applied to the top-level element.
onFocus | function | Callback invoked when the token is focused. Should be applied to the top-level element.
onKeyDown | function | Callback invoked when the token is focused and a key is pressed. Should be applied to the top-level element.
onRemove | function | Callback used to handle token removal. This typically would be applied to the `onClick` handler of a "remove" or "x" button in the token.
ref | Used for detecting clicks outside the token and updating internal state accordingly. Should be applied to the top-level DOM node.

```jsx
// Important: use `forwardRef` to pass the ref on to the underlying DOM nodes.
const MyToken = forwardRef(({ active, onRemove, ...props }, ref) => (
  <div
    {...props}
    className={active ? 'active' : ''}
    ref={ref}>
    <button onClick={onRemove}>
      x
    </button>
  </div>
));

// HOC
const CustomToken = withToken(MyToken);

// Hook
const CustomToken = (props) => <MyToken {...useToken(props)} />;
```
If using the hook, you can also apply it directly within your token component:
```jsx
const MyToken = (props) => {
  const { active, onRemove, ref, ...otherProps } = useToken(props);

  return (
    <div
      {...otherProps}
      className={active ? 'active' : ''}
      ref={ref}>
      <button onClick={onRemove}>
        x
      </button>
    </div>
  );
};
```

### `useHint`
Hook for adding a hint to a custom input. Mainly useful if you'd like to customize the hint's markup.

```jsx
const CustomHint = (props) => {
  const { hintRef, hintText } = useHint(props);

  return (
    <div ... >
      {props.children}
      <input
        ...
        ref={hintRef}
        value={hintText}
      />
    </div>
  );
};
```
See the [`Hint` component](https://github.com/ericgio/react-bootstrap-typeahead/blob/master/src/components/Hint.js#L136) for an example of how to apply `useHint`.
