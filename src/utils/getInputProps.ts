import cx from 'classnames';

import getMenuItemId from './getMenuItemId';
import hasOwnProperty from './hasOwnProperty';
import { TypeaheadManagerProps } from '../types';

const getInputProps =
  ({
    activeIndex,
    id,
    isFocused,
    isMenuShown,
    multiple,
    onClick,
    onFocus,
    placeholder,
    ...rest
  }: TypeaheadManagerProps) =>
  (inputProps = {}) => {
    const className = hasOwnProperty(inputProps, 'className')
      ? inputProps.className
      : undefined;

    const props = {
      // These props can be overridden by values in `inputProps`.
      autoComplete: 'off',
      placeholder,
      type: 'text',

      ...inputProps,
      ...rest,
      'aria-activedescendant':
        activeIndex >= 0 ? getMenuItemId(id, activeIndex) : undefined,
      'aria-autocomplete': 'both',
      'aria-expanded': isMenuShown,
      'aria-haspopup': 'listbox',
      'aria-owns': isMenuShown ? id : undefined,
      className: cx({
        [(className || '') as string]: !multiple,
        focus: isFocused,
      }),
      onClick,
      onFocus,
      // Comboboxes are single-select by definition:
      // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
      role: 'combobox',
    };

    if (!multiple) {
      return props;
    }

    return {
      ...props,
      'aria-autocomplete': 'list',
      'aria-expanded': undefined,
      inputClassName: className,
      role: undefined,
    };
  };

export default getInputProps;
