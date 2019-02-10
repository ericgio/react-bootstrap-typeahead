import cx from 'classnames';
import React from 'react';

import { InputContext } from './Context';
import { getMenuItemId } from '../utils';

const TypeaheadInput = ({ children }) => (
  <InputContext.Consumer>
    {(context) => {
      const {
        activeIndex,
        id,
        inputProps,
        isFocused,
        isMenuShown,
        labelKey,
        multiple,
        onFocus,
        onRemove,
        placeholder,
        selected,
        ...otherProps
      } = context;

      // Add a11y-related props.
      let props = {
        ...inputProps,
        ...otherProps,
        'aria-activedescendant': activeIndex >= 0 ?
          getMenuItemId(id, activeIndex) :
          '',
        'aria-autocomplete': multiple ? 'list' : 'both',
        'aria-expanded': isMenuShown,
        'aria-haspopup': 'listbox',
        'aria-owns': isMenuShown ? id : '',
        autoComplete: inputProps.autoComplete || 'off',
        // Re-open the menu, eg: if it's closed via ESC.
        onClick: onFocus,
        onFocus,
        placeholder: selected.length ? null : placeholder,
        // Comboboxes are single-select by definition:
        // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
        role: 'combobox',
        type: inputProps.type || 'text',
      };

      const className = props.className || '';

      if (multiple) {
        props = {
          ...props,
          'aria-expanded': undefined,
          inputClassName: className,
          labelKey,
          onRemove,
          role: undefined,
          selected,
        };
      }

      props.className = cx({
        [className]: !multiple,
        focus: isFocused,
      });

      return children(props);
    }}
  </InputContext.Consumer>
);

export default TypeaheadInput;
