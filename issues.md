# Issues addressed in pull request

### NVDA+Firefox reads first two options when input gains focus

Replace `aria-owns` by `aria-controls`.

The `aria-owns` attribute is meant to reorganize the accessibility tree in order to override the accessibility tree built from the source markup.
Input elements cannot have children.  If the 1.0 combobox pattern is used (such as in this widgit), the combobox role is placed on the `input` element, thus `aria-owns` is not valid since `input` elements cannot have children.  If the 1.1 combobox pattern is used, then the combobox role  must be placed on a container element, and both the input and list must be "owned" by that container. In such cases, the author has the flexability to place the list outside of the combobox container because `aria-owns` will cause it to be placed inside the container in the accessibility tree.  

_Note: Screen readers which follow specs do not interact with the DOM directly; they only interact with the accessibility tree._

See this article for a more thurrough explanation of `aria-owns`: https://labs.levelaccess.com/index.php/ARIA-owns_Table


### Screen reader announces widgit as "expanded" when screen reader focus is in `input`

The "expanded" announcement in this context means that screen reader focus is in the list.
This happens due to `aria-activedescendant` being set, which tells the accessibility layer that even though the browser thinks focus is still in the `input`, screen reader focus should be in the list.
Thus, `aria-expanded` should be set to "true" only if the list is active and meant to have screen reader focus.

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
Oddly enough, if we have more than one selected element, and the one in tab order just *before* the `input` is removed, screen reader focus does not end up in `input`, however if the other one is removed then the `input` gains focus and the screen reader acknowledges this fact.

### lint

>src/token.react.js line 27: elements with role of "button" must be tabbable.

`tabindex="0"` exists on the element.

Fixed with eslint comments.

### Added `aria-multiselectable` to the list

This should be present and set to "true" when prop multiple is set, "false" otherwise.

Additionally, when in multiselect mode, each menu item `role="option"` must have `aria-selected="false"` for all unselected options and `aria-selected="true"` for selected ones.

Unlike single select mode where _selection follows focus_, keyboard interaction in multiselect mode is to allow toggling selection via the space key.  Enter key will add all selected options to the tokenizer.

Unfortunately, because the `aria-activedescendant` pattern is used, spacebar enters a space character into the `input`, so cannot be used to toggle selected state of currently *focused* option.
I am proposing either that we use a different key (such as control+space to toggle selection which is the simplest solution at present), or in keyboard handler, detect whether `aria-activedescendant` is non-null, in which case we toggle selected state of current option, otherwise we place a space character in the `input`. This latter option may be confusing for sighted users who would most likely expect the space character to show up and filter the list accordingly.

### NVDA+Firefox repeating contents of live region

This seems to be due to rerendering of the typeahead component multiple times during a search / filter.

The fix is:
- add componentWillReceiveProps handler to menu.react.js which fires a callback when the number of results changes
- add code to this callback to write status info to the live region
	+ update live region when menu is shown and when menu length changes


### Testing

Added tests for all the above.

#### Separated out tests involving live region (i.e. a11y status messages)

This seems to be necessary because of the way I'm updating the live region.
I'm doing direct updates using ID rather than letting react handle it. This allows me to control timing and insure no repetition.

a timeout is used to update live region because otherwise, reading label text / placeholder gets cut off by live region announcement. Theoretically, `aria-live="polite"` is supposed to queue speech, however I've never seen a screen reader do this correctly.

I'm using a library called "react-testing-library", which allows me to render to a real dom, then test again the real dom.

Using the Enzyme mounted component, and writing something like:

```
expect(statusNode.textContent).to.contain('50 results');
```

would always fais, and `statusNode.text()` would always be the empty string.
Adding a delay did not solve the problem using the enzyme mounted component, whereas it did work using "react-testing-library" and rendering to dom first.

I've thus added "a11yResultsSpec.js" to test/components directory.
