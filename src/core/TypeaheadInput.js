import cx from 'classnames';
import {getInputText, getMenuItemId} from '../utils';

const TypeaheadInput = (props) => {
  const {
    activeIndex,
    bsSize,
    children,
    disabled,
    getReferenceElement,
    inputRef,
    isFocused,
    isInvalid,
    isMenuShown,
    isValid,
    labelKey,
    menuId,
    multiple,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onRemove,
    placeholder,
    renderToken,
    selected,
  } = props;

  // Add a11y-related props.
  let inputProps = {
    ...props.inputProps,
    'aria-activedescendant': activeIndex >= 0 ?
      getMenuItemId(activeIndex) :
      '',
    'aria-autocomplete': multiple ? 'list' : 'both',
    'aria-expanded': isMenuShown,
    'aria-haspopup': 'listbox',
    'aria-owns': isMenuShown ? menuId : '',
    autoComplete: props.inputProps.autoComplete || 'nope',
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
      multiple,
      onRemove,
      renderToken,
      role: undefined,
      selected,
    };
  }

  inputProps.className = cx('rbt-input', {
    [className]: !multiple,
    focus: isFocused,
    'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
    'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
    'is-invalid': isInvalid,
    'is-valid': isValid,
  });

  inputProps.ref = getReferenceElement;

  return children(inputProps);
};

export default TypeaheadInput;
