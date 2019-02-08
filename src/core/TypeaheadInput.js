import cx from 'classnames';
import { getInputText, getMenuItemId } from '../utils';

const TypeaheadInput = (props) => {
  const {
    activeIndex,
    children,
    disabled,
    getReferenceElement,
    inputRef,
    isFocused,
    isMenuShown,
    labelKey,
    menuId,
    multiple,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onRemove,
    placeholder,
    selected,
  } = props;

  // Add a11y-related props.
  let inputProps = {
    ...props.inputProps,
    'aria-activedescendant': activeIndex >= 0 ?
      getMenuItemId(menuId, activeIndex) :
      '',
    'aria-autocomplete': multiple ? 'list' : 'both',
    'aria-expanded': isMenuShown,
    'aria-haspopup': 'listbox',
    'aria-owns': isMenuShown ? menuId : '',
    autoComplete: props.inputProps.autoComplete || 'off',
    disabled,
    inputRef,
    onBlur,
    onChange,
    // Re-open the menu, eg: if it's closed via ESC.
    onClick: onFocus,
    onFocus,
    onKeyDown,
    placeholder: selected.length ? null : placeholder,
    // Comboboxes are single-select by definition:
    // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
    role: 'combobox',
    value: getInputText(props),
  };

  const className = inputProps.className || '';

  if (multiple) {
    inputProps = {
      ...inputProps,
      'aria-expanded': undefined,
      inputClassName: className,
      labelKey,
      onRemove,
      role: undefined,
      selected,
    };
  }

  inputProps.className = cx({
    [className]: !multiple,
    focus: isFocused,
  });

  inputProps.ref = getReferenceElement;

  return children(inputProps);
};

export default TypeaheadInput;
