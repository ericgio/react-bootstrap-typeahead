/* eslint-disable react/prefer-stateless-function */

import cx from 'classnames';
import React from 'react';

import {getDisplayName, getInputText, getMenuItemId} from '../utils';

function inputContainer(Input) {
  class WrappedInput extends React.Component {
    static displayName = `InputContainer(${getDisplayName(Input)})`;

    render() {
      const {
        activeIndex,
        bsSize,
        disabled,
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
      } = this.props;

      // Add a11y-related props.
      let inputProps = {
        ...this.props.inputProps,
        'aria-activedescendant': activeIndex >= 0 ?
          getMenuItemId(activeIndex) :
          '',
        'aria-autocomplete': multiple ? 'list' : 'both',
        'aria-expanded': isMenuShown,
        'aria-haspopup': 'listbox',
        'aria-owns': menuId,
        autoComplete: this.props.inputProps.autoComplete || 'nope',
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
        value: getInputText(this.props),
      };

      const className = inputProps.className || '';

      if (multiple) {
        inputProps = {
          ...inputProps,
          inputClassName: className,
          labelKey,
          onRemove,
          renderToken,
          role: '',
          selected,
        };
      }

      return (
        <Input
          {...inputProps}
          className={cx('rbt-input', {
            [className]: !multiple,
            focus: isFocused,
            'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
            'is-invalid': isInvalid,
            'is-valid': isValid,
          })}
        />
      );
    }
  }

  return WrappedInput;
}

export default inputContainer;
