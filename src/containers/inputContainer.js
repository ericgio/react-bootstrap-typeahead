import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName, getHintText, getInputText, getMenuItemId} from '../utils/';

function inputContainer(Input) {
  class WrappedInput extends React.Component {
    state = {
      isFocused: false,
    };

    getChildContext() {
      const {initialItem, onAdd, selectHintOnEnter} = this.props;

      return {
        hintText: getHintText(this.props),
        initialItem,
        onAdd,
        selectHintOnEnter,
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
        'aria-controls': menuId,
        'aria-expanded': isMenuShown && activeIndex >= 0,
        'aria-haspopup': 'listbox',
        autoComplete: 'off',
        disabled,
        inputRef,
        onBlur: this._handleBlur,
        onChange,
        // Re-open the menu, eg: if it's closed via ESC.
        onClick: this._handleFocus,
        onFocus: this._handleFocus,
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
            'focus': this.state.isFocused,
            'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
          })}
        />
      );
    }

    _handleBlur = (e) => {
      e.persist();
      this.setState({isFocused: false}, () => this.props.onBlur(e));
    }

    _handleFocus = (e) => {
      e.persist();
      this.setState({isFocused: true}, () => this.props.onFocus(e));
    }
  }

  WrappedInput.displayName = `InputContainer(${getDisplayName(Input)})`;

  WrappedInput.childContextTypes = {
    hintText: PropTypes.string.isRequired,
    initialItem: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.string.isRequired,
    ]),
    onAdd: PropTypes.func.isRequired,
    selectHintOnEnter: PropTypes.bool.isRequired,
  };

  return WrappedInput;
}

export default inputContainer;
