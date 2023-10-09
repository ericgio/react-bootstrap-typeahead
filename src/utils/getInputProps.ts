import cx from 'classnames';

import getMenuItemId from './getMenuItemId';
import hasOwnProperty from './hasOwnProperty';
import {OptionType, TypeaheadManagerProps} from '../types';

type Args<Option extends OptionType> = Pick<
  TypeaheadManagerProps<Option>,
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
  <Option extends OptionType>({
    activeIndex,
    id,
    isFocused,
    isMenuShown,
    multiple,
    onClick,
    onFocus,
    placeholder,
    ...props
  }: Args<Option>) =>
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
      ...(multiple && { inputClassName: className }),
      onClick,
      onFocus,
      role: 'combobox',
    };
  };

export default getInputProps;
