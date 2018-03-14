# Props

### `<Typeahead>`
Name | Type | Default | Description
-----|------|---------|------------
a11yNumResults | function | | For localized accessibility: Should return a string indicating the number of results for screen readers. Receives the current results.
a11yNumSelected | function | | For localized accessibility: Should return a string indicating the number of selections for screen readers. Receives the current selections.
align | One of: `justify`, `left`, `right` | 'justify' | Specify menu alignment. The default value is `justify`, which makes the menu as wide as the input and truncates long values. Specifying `left` or `right` will align the menu to that side and the width will be determined by the length of menu item values.
allowNew | boolean | false | Allows the creation of new selections on the fly. Any new items will be added to the list of selections, but not the list of original options unless handled as such by `Typeahead`'s parent. The newly added item will *always* be returned as an object even if the other options are simply strings, so be sure your `onChange` callback can handle this.
autoFocus | boolean | false | Autofocus the input when the component initially mounts.
bodyContainer | boolean | false | Whether to render the menu inline or attach to `document.body`.
bsSize | one of: `'large'`, `'lg'`, `'small'`, `'sm'` | | Specify the size of the input.
caseSensitive | boolean | false | Whether or not filtering should be case-sensitive.
clearButton | boolean | false | Displays a button to clear the input when there are selections.
defaultInputValue | string | '' | The initial value displayed in the text input.
defaultSelected | array | `[]` | Specify any pre-selected options. Use only if you want the component to be uncontrolled.
disabled | boolean | | Whether to disable the input. Will also disable selections when `multiple={true}`.
dropup | boolean | false | Specify whether the menu should appear above the input.
emptyLabel | node | 'No matches found.' | Message displayed in the menu when there are no valid results. Passing a falsy value will hide the menu if no matches are found.
filterBy | function or array | `[]` | Either an array of fields in `option` to search, or a custom filtering callback.
highlightOnlyResult | boolean | false | Highlights the menu item if there is only one result and allows selecting that item by hitting enter. Does not work with `allowNew`.
ignoreDiacritics | boolean | true | Whether the filter should ignore accents and other diacritical marks.
inputProps | object | {} | Props to be applied directly to the input. `onBlur`, `onChange`, `onFocus`, and `onKeyDown` are ignored.
isLoading | boolean | false | Indicate whether an asynchronous data fetch is happening.
labelKey | string or function | 'label' | Specify which option key to use for display or a render function. By default, the selector will use the `label` key.
maxHeight | number | 300 | Maximum height of the dropdown menu, in px.
maxResults | number | 100 | Maximum number of results to display by default. Mostly done for performance reasons so as not to render too many DOM nodes in the case of large data sets.
menuId | string | {random} | Id applied to the top-level menu element. Required for accessibility.
minLength | number | 0 | Number of input characters that must be entered before showing results.
multiple | boolean | false | Whether or not multiple selections are allowed.
name | string | | DEPRECATED. Name attribute for the input.
newSelectionPrefix | string | 'New selection:' | Provides the ability to specify a prefix before the user-entered text to indicate that the selection will be new. No-op unless `allowNew={true}`.
onBlur | function | | Invoked when the input is blurred. Receives an event.
onChange | function | | Invoked whenever items are added or removed. Receives an array of the selected options.
onFocus | function | | Invoked when the input is focused. Receives an event.
onInputChange | function | | Invoked when the input value changes. Receives the string value of the input.
onKeyDown | function | | Invoked when a key is pressed. Receives an event.
onMenuHide | function | | Invoked when the menu is hidden.
onMenuShow | function | | Invoked when the menu is shown.
onPaginate | function | | Invoked when the pagination menu item is clicked.
options `required` | array | | Full set of options, including any pre-selected options.
paginate | boolean | true | Give user the ability to display additional results if the number of results exceeds `maxResults`.
paginationText | string | 'Display additional results...' | Prompt displayed when large data sets are paginated.
placeholder | string | | Placeholder text for the input.
renderMenu | function | | Callback for custom menu rendering.
renderMenuItemChildren | function | | Provides a hook for customized rendering of menu item contents.
renderToken | function | | Provides a hook for customized rendering of tokens when multiple selections are enabled.
selected | array | `[]` | The selected option(s) displayed in the input. Use this prop if you want to control the component via its parent.
selectHintOnEnter | boolean | false | Allows selecting the hinted result by pressing enter.
submitFormOnEnter | boolean | false | Propagate <RETURN> event to parent form.

### `<AsyncTypeahead>`
Name | Type | Default | Description
-----|------|---------|------------
delay | number | 200 | Delay, in milliseconds, before performing search.
isLoading `required` | boolean | | Whether or not a request is currently pending. Necessary for the component to know when new results are available.
onSearch `required` | function | | Callback to perform when the search is executed.
options | array | `[]` | Options to be passed to the typeahead. Will typically be the query results, but can also be initial default options.
promptText | node | 'Type to search...' | Message displayed in the menu when there is no user input.
searchText | node | 'Searching...' | Message to display in the menu while the request is pending.
useCache | bool | true | Whether or not the component should cache query results.

[Next: API Reference](API.md)
