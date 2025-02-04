import cx from 'classnames';
import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  RefCallback,
} from 'react';

import getMenuItemId from './getMenuItemId';
import { Id } from '../types';

interface Args {
  activeIndex: number;
  id?: Id;
  inputRef: RefCallback<HTMLInputElement>;
  isFocused: boolean;
  isMenuShown: boolean;
  multiple: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
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
    ...props
  }: Args) =>
  ({
    className,
    ...inputProps
  }: InputHTMLAttributes<HTMLInputElement> = {}) => {
    return {
      // These props can be overridden by values in `inputProps`.
      autoComplete: 'off',
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
