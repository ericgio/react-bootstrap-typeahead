import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName, getHintText, getInputText, getMenuItemId} from '../utils/';

import {RETURN, RIGHT, TAB} from '../constants/keyCode';

function inputContainer(Input) {
  class WrappedInput extends React.Component {
    state = {
      isFocused: false,
    };

    getChildContext() {
      return {
        hintText: getHintText(this.props),
      };
    }

    render() {
      const {
        activeIndex,
        bsSize,
        disabled,
        inputRef,
        isMenuShown,
        labelKey,
        menuId,
        multiple,
        onChange,
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
        autoComplete: 'off',
        disabled,
        inputRef,
        onBlur: this._handleBlur,
        onChange,
        // Re-open the menu, eg: if it's closed via ESC.
        onClick: this._handleFocus,
        onFocus: this._handleFocus,
        onKeyDown: this._handleKeyDown,
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
            'focus': this.state.isFocused,
            'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
          })}
        />
      );
    }

    _handleBlur = (e) => {
      this.props.onBlur(e);
      this.setState({isFocused: false});
    }

    _handleFocus = (e) => {
      this.props.onFocus(e);
      this.setState({isFocused: true});
    }

    _handleKeyDown = (e) => {
      const {initialItem, onAdd, onKeyDown, selectHintOnEnter} = this.props;

      const hint = getHintText(this.props);
      const value = getInputText(this.props);

      if (!hint) {
        onKeyDown(e);
        return;
      }

      switch (e.keyCode) {
        case RETURN:
          selectHintOnEnter && onAdd(initialItem);
          break;
        case RIGHT:
          e.target.selectionStart === value.length && onAdd(initialItem);
          break;
        case TAB:
          onAdd(initialItem);
          break;
      }

      onKeyDown(e);
    }
  }

  WrappedInput.displayName = `InputContainer(${getDisplayName(Input)})`;

  WrappedInput.childContextTypes = {
    hintText: PropTypes.string.isRequired,
  };

  return WrappedInput;
}

export default inputContainer;
