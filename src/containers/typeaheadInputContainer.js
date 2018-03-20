import {head} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

import {getHintText, getInputText, getMenuItemId} from '../utils/';

import {BACKSPACE, RETURN, RIGHT, TAB} from '../constants/keyCode';

function typeaheadInputContainer(Input) {
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
        disabled,
        isMenuShown,
        menuId,
        multiple,
        placeholder,
        selected,
      } = this.props;

      // Add a11y-related props.
      const inputProps = {
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
        onBlur: this._handleBlur,
        onChange: this._handleChange,
        onClick: this._handleFocus,
        onFocus: this._handleFocus,
        onKeyDown: this._handleKeyDown,
        placeholder: selected.length ? null : placeholder,
        // Comboboxes are single-select by definition:
        // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
        role: multiple ? '' : 'combobox',
        value: getInputText(this.props),
      };

      return (
        <Input
          {...this.props}
          inputProps={inputProps}
          inputRef={(input) => this._input = input}
          isFocused={this.state.isFocused}
        />
      );
    }

    getInputNode() {
      return typeof this._input.getInput === 'function' ?
        this._input.getInput() :
        this._input;
    }

    _handleBlur = (e) => {
      // Note: Don't hide the menu here, since that interferes with other
      // actions like making a selection by clicking on a menu item.
      this.props.onBlur(e);
      this.setState({isFocused: false});
    }

    _handleChange = (e) => {
      const {multiple, onChange, onRemove, selected} = this.props;

      if (!multiple) {
        // Clear any selections when text is entered.
        !!selected.length && onRemove(head(selected));
      }

      onChange(e);
    }

    _handleFocus = (e) => {
      this.props.onFocus(e);
      this.setState({isFocused: true});
    }

    _handleKeyDown = (e) => {
      const {
        activeItem,
        initialItem,
        multiple,
        onAdd,
        selected,
        selectHintOnEnter,
      } = this.props;

      const value = getInputText(this.props);

      switch (e.keyCode) {
        case BACKSPACE:
          if (!multiple) {
            break;
          }

          const inputContainer = findDOMNode(this._input);
          if (
            inputContainer &&
            inputContainer.contains(document.activeElement) &&
            !value
          ) {
            // If the input is selected and there is no text, select the last
            // token when the user hits backspace.
            const sibling = inputContainer.parentElement.previousSibling;
            sibling && sibling.focus();

            // Prevent browser "back" action.
            e.preventDefault();
          }
          break;
        case RETURN:
        case RIGHT:
        case TAB:
          // TODO: Support hinting for multi-selection.
          if (multiple) {
            break;
          }

          const hintText = getHintText(this.props);
          const {selectionStart} = e.target;

          // Autocomplete the selection if all of the following are true:
          if (
            // There's a hint or a menu item is highlighted.
            (hintText || activeItem) &&
            // There's no current selection.
            !selected.length &&
            // The input cursor is at the end of the text string when the user
            // hits the right arrow key.
            !(e.keyCode === RIGHT && selectionStart !== value.length) &&
            !(e.keyCode === RETURN && !selectHintOnEnter)
          ) {
            e.preventDefault();

            const selectedOption = hintText ? initialItem : activeItem;

            onAdd && onAdd(selectedOption);
          }
          break;
      }

      this.props.onKeyDown(e);
    }
  }

  WrappedInput.childContextTypes = {
    hintText: PropTypes.string.isRequired,
  };

  return WrappedInput;
}

export default typeaheadInputContainer;
