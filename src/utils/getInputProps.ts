import cx from 'classnames';
import { SyntheticEvent } from 'react';

import getMenuItemId from './getMenuItemId';
import hasOwnProperty from './hasOwnProperty';
import { isFunction } from './nodash';
import { TypeaheadManagerProps } from '../types';

const getInputProps =
  ({
    activeIndex,
    id,
    isFocused,
    isMenuShown,
    multiple,
    onFocus,
    placeholder,
    ...rest
  }: TypeaheadManagerProps) =>
  ({ className, ...inputProps }: Record<string, unknown>) => {
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
      onClick: (e: SyntheticEvent<HTMLInputElement>) => {
        // Re-open the menu if it's closed, eg: via ESC.
        onFocus && onFocus(e);
        hasOwnProperty(inputProps, 'onClick') &&
          isFunction(inputProps.onClick) &&
          inputProps.onClick(e);
      },
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
