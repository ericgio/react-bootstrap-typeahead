// @flow

import cx from 'classnames';

import getMenuItemId from './getMenuItemId';

import type { TypeaheadManagerProps } from '../types';

const getInputProps = ({
  activeIndex,
  id,
  isFocused,
  isMenuShown,
  multiple,
  onFocus,
  placeholder,
  ...rest
}: TypeaheadManagerProps) => ({ className, ...inputProps }: Object = {}) => {
  const props = {
    /* eslint-disable sort-keys */
    // These props can be overridden by values in `inputProps`.
    autoComplete: 'off',
    placeholder,
    type: 'text',

    ...inputProps,
    ...rest,
    'aria-activedescendant': activeIndex >= 0 ?
      getMenuItemId(id, activeIndex) :
      undefined,
    'aria-autocomplete': 'both',
    'aria-expanded': isMenuShown,
    'aria-haspopup': 'listbox',
    'aria-owns': isMenuShown ? id : undefined,
    className: cx({
      [className || '']: !multiple,
      focus: isFocused,
    }),
    onClick: (e) => {
      // Re-open the menu if it's closed, eg: via ESC.
      onFocus && onFocus(e);
      inputProps.onClick && inputProps.onClick(e);
    },
    onFocus,
    // Comboboxes are single-select by definition:
    // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
    role: 'combobox',
    /* eslint-enable sort-keys */
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
