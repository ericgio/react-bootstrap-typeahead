// @flow

import cx from 'classnames';

import getMenuItemId from './getMenuItemId';

import type { TypeaheadInnerProps } from '../types';

const getInputProps = ({
  activeIndex,
  getReferenceElement,
  id,
  isFocused,
  isMenuShown,
  labelKey,
  multiple,
  onFocus,
  onRemove,
  placeholder,
  ...rest
}: TypeaheadInnerProps) => ({ className, ...inputProps }: Object = {}) => {
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
      '',
    'aria-autocomplete': 'both',
    'aria-expanded': isMenuShown,
    'aria-haspopup': 'listbox',
    'aria-owns': isMenuShown ? id : '',
    className: cx({
      [className || '']: !multiple,
      focus: isFocused,
    }),
    // Re-open the menu, eg: if it's closed via ESC.
    onClick: onFocus,
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
    onRemove,
    role: undefined,
  };
};

export default getInputProps;
