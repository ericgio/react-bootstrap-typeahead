import cx from 'classnames';

import getMenuItemId from './getMenuItemId';
import hasOwnProperty from './hasOwnProperty';
import { TypeaheadManagerProps } from '../types';

type Args = Pick<
  TypeaheadManagerProps,
  | 'activeIndex'
  | 'id'
  | 'isFocused'
  | 'isMenuShown'
  | 'multiple'
  | 'onClick'
  | 'onFocus'
  | 'placeholder'
>;

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
    ...props
  }: Args) =>
  (inputProps = {}) => {
    const className = hasOwnProperty(inputProps, 'className')
      ? String(inputProps.className)
      : undefined;

    return {
      // These props can be overridden by values in `inputProps`.
      autoComplete: 'off',
      placeholder,
      type: 'text',

      ...inputProps,
      ...props,
      'aria-activedescendant':
        activeIndex >= 0 ? getMenuItemId(id, activeIndex) : undefined,
      'aria-autocomplete': 'both',
      'aria-expanded': isMenuShown,
      'aria-haspopup': 'listbox',
      'aria-multiselectable': multiple || undefined,
      'aria-owns': isMenuShown ? id : undefined,
      className: cx({
        [className || '']: !multiple,
        focus: isFocused,
      }),
      inputClassName: multiple ? className : undefined,
      onClick,
      onFocus,
      role: 'combobox',
    };
  };

export default getInputProps;
