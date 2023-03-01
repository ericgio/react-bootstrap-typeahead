import cx from 'classnames';

import getMenuItemId from './getMenuItemId';
import hasOwnProperty from './hasOwnProperty';
import { TypeaheadManagerProps } from '../types';

interface Args
  extends Pick<
    TypeaheadManagerProps,
    | 'activeIndex'
    | 'id'
    | 'inputRef'
    | 'isFocused'
    | 'isMenuShown'
    | 'multiple'
    | 'onBlur'
    | 'onChange'
    | 'onClick'
    | 'onFocus'
    | 'onKeyDown'
    | 'placeholder'
  > {
  disabled?: boolean;
  value: string;
}

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
      'aria-autocomplete': 'both' as const,
      'aria-expanded': isMenuShown,
      'aria-haspopup': 'listbox' as const,
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
