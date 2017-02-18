# API Reference
The components and higher-order components (HOCs) described below are publicly exposed in the top-level module. Other components should be considered private and subject to change without notice.

- [Components](#components)
  - [`<Typeahead>`](#typeahead)
  - [`<AsyncTypeahead>`](#asynctypeahead)
  - [`<Menu>`](#menu)
  - [`<MenuItem>`](#menuitem)
  - [`<Token>`](#token)
- [Higher-Order Components](#higher-order-components)
  - [`asyncContainer`](#asynccontainer)
  - [`menuItemContainer`](#menuitemcontainer)
  - [`tokenContainer`](#tokencontainer)

## Components
Only a subset of props are documented below, primarily those expecting functions. See the [props documentation](Props.md) for the full list of options.

### `<Typeahead>`
The primary component provided by the module. 

#### Props

##### `filterBy`
See full documentation in the [Filtering section](Filtering.md#filterby).

##### `labelKey`, `renderMenu`, `renderMenuItemChildren`, and `renderToken`
See full documentation in the [Rendering section](Rendering.md).

##### `onChange(selectedItems)`
Invoked when the set of selections changes (ie: an item is added or removed). For consistency, `selectedItems` is always an array of selections, even multi-selection is not enabled.

##### `onInputChange(text)`
Invoked when the input value changes. Receives the string value of the input (`text`).

##### `onPaginate(event)`
Invoked when the pagination menu item is clicked. Receives an event.

##### `onBlur(event)` & `onFocus(event)`
As with a normal text input, these are called when the typeahead input is focused or blurred.

### `<AsyncTypeahead>`
An enhanced version of the normal `Typeahead` component for use when performing asynchronous searches. Provides debouncing of user input, optional query caching, and search prompt, empty results, and pending request behaviors.

```jsx
<AsyncTypeahead
  onSearch={query => (
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(resp => resp.json())
      .then(json => this.setState({options: json.items}));
  )}
  options={this.state.options}
/>
```

Note that this component is the same as:
```jsx
import {asyncContainer, Typeahead} from 'react-bootstrap-typeahead';

const AsyncTypeahead = asyncContainer(Typeahead);
```

#### Props

##### `onSearch(query)` (required)
Callback to perform when the search is executed. `query` is the text string entered by the user.

### `<Menu>`
Provides the markup for a Bootstrap menu, along with some extra functionality for alignment, paginating results, and specifying empty label text.

### `<MenuItem>`
Provides the markup for a Bootstrap menu item, but is wrapped with the `menuItemContainer` HOC to ensure proper behavior within the typeahead context. Provided for use if a more customized `Menu` is desired.

#### Props

##### `option` (required)
The data item to be displayed.

##### `position`
The position of the data item within the data set. This allows you to reorder or group your data within `renderMenu` while allowing the top-level `Typeahead`component to be be aware of this. Required for proper highlighting of menu items when keying through the menu.

### `<Token>`
Individual token component, most commonly for use within `renderToken` to customize the `Token` contents.

## Higher-Order Components

### `asyncContainer`
The HOC used in [`AsyncTypeahead`](#asynctypeahead).

### `menuItemContainer`
Connects individual menu items with the main typeahead component via context and abstracts a lot of complex functionality required for behaviors like keying through the menu and input hinting. Also provides `onClick` behavior and active state.

If you use your own menu item components (in `renderMenu` for example), you are strongly advised to wrap them with this HOC:

```jsx
import {MenuItem} from 'react-bootstrap';
import {Menu, menuItemContainer, Typeahead} from 'react-bootstrap-typeahead';

const TypeaheadMenuItem = menuItemContainer(MenuItem);

<Typeahead
  renderMenu={(results, menuProps) => (
    <Menu {...menuProps}>
      {results.map((result, props) => (
        <TypeaheadMenuItem>
          {result.label}
        </TypeaheadMenuItem>
      ))}
    </Menu>
  )}
/>
```

### `tokenContainer`
Encapsulates keystroke and outside click behaviors used in `Token`. Useful if you want completely custom markup for the token.

```jsx
const MyCustomToken = tokenContainer(props => (
  // Your token code...
));

<Typeahead
  multiple
  options={options}
  renderToken={(selectedItem, onRemove) => (
    <MyCustomToken onRemove={onRemove} option={selectedItem} />
  )}
/>
```
