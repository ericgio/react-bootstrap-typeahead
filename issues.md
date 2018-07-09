# Issues addressed in pull request

### NVDA+Firefox reads first two options when input gains focus

Replace `aria-owns` by `aria-controls`.

The `aria-owns` attribute is meant to reorganize the accessibility tree in order to override the accessibility tree built from the source markup.
Input elements cannot have children.  If the 1.0 combobox pattern is used (such as in this widgit), the combobox role is placed on the `input` element, thus `aria-owns` is not valid since `input` elements cannot have children.  If the 1.1 combobox pattern is used, then the combobox role  must be placed on a container element, and both the input and list must be "owned" by that container. In such cases, the author has the flexability to place the list outside of the combobox container because `aria-owns` will cause it to be placed inside the container in the accessibility tree.  

_Note: Screen readers which follow specs do not interact with the DOM directly; they only interact with the accessibility tree._

See this article for a more thurrough explanation of `aria-owns`: https://labs.levelaccess.com/index.php/ARIA-owns_Table

- `'aria-controls': menuId`

### Screen reader announces widgit as "expanded" when screen reader focus is in `input`

The "expanded" announcement in this context means that screen reader focus is in the list.
This may happen due to `aria-activedescendant` being set, or if `tabindex` is used to an `option` element being placed in the tab order via `tabindex="0"`.
In either case, `aria-expanded` should be set to "true" only if the list is active and meant to have screen reader focus.
Note that browser focus may be different. For instance, when `aria-activedescendant` is used, screen reader focus is in the listbox, while browser focus remains in the `input` element.

- `'aria-expanded': isMenuShown && activeIndex >= 0`

### Screen reader should announce number of selections only if `multiple` is set

When in single select mode, it is obvious which element is selected and by definition, only one can be selected at a time, so announcement in this case is superfluous.

### Removing selections

- added the text of the selection to the label of the ClearButton
- hid the word "remove" in ClearButton's parent div from screen readers
- parent div now has tabIndex:-1 so only the ClearButton is now in tab order
- clicking either text "remove" or ClearButton with mouse removes selection
- pressing enter on ClearButton removes selection

This now allows screen reader users to tab among the selections and hear "remove xxx" as each gains focus, and to press enter to remove selection.
Previously, only the text of selection was announced when tabbing, and since the actual ClearButton was  not focusable, needed to use screen reader commands to navigate to the ClearButton.

### Removal of selection does not refocus input

This may be an NVDA+Firefox bug.
Code is correct, and verified that document.activeElement is set to the correct element after removal.

### lint

>src/token.react.js line 27: elements with role of "button" must be tabbable.

`tabindex="0"` exists on the element.

Fixed with eslint comments.

### Added `aria-multiselectable` to the list

This should be present and set to "true" when prop multiple is set, "false" otherwise.

Additionally, when in multiselect mode, each menu item `role="option"` must have `aria-selected="false"` for all unselected options and `aria-selected="true"` for selected ones.

Unlike single select mode where _selection follows focus_, keyboard interaction in multiselect mode is to allow toggling selection via the space key.  Enter key will add all selected options to the tokenizer.

### NVDA+Firefox repeating contents of live region

This seems to be due to rerendering of the typeahead component multiple times during a search.

The fix is:
- add componentWillReceiveProps handler to menu.react.js which fires a callback when the number of results changes
- add code to this callback to write status info to the live region
- also add code to onMenuShow() and onMenuHide callbacks to do same


