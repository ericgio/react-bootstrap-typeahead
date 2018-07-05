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

