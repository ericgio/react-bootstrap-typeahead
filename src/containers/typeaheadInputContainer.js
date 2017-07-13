import {head} from 'lodash';
import React from 'react';
import {findDOMNode} from 'react-dom';

import getHintText from '../utils/getHintText';
import getInputText from '../utils/getInputText';

import {BACKSPACE, RETURN, RIGHT, TAB} from '../utils/keyCode';

function typeaheadInputContainer(Input) {
  class WrappedInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFocused: false,
      };
    }

    render() {
      const {placeholder, selected} = this.props;

      return (
        <Input
          {...this.props}
          {...this.state}
          hintText={getHintText(this.props)}
          inputRef={input => this._input = input}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onInputFocus={this._handleInputFocus}
          onKeyDown={this._handleKeyDown}
          placeholder={selected.length ? null : placeholder}
          value={getInputText(this.props)}
        />
      );
    }

    blur() {
      this._input.blur();
    }

    focus() {
      this._handleInputFocus();
    }

    _handleBlur = e => {
      this.setState({isFocused: false});
      this.props.onBlur(e);
    }

    _handleChange = e => {
      const {multiple, onChange, onRemove, selected} = this.props;

      if (!multiple) {
        // Clear any selections when text is entered.
        !!selected.length && onRemove(head(selected));
      }

      onChange(e.target.value);
    }

    _handleInputFocus = e => {
      const isClearButton =
        e &&
        e.target &&
        e.target.className &&
        e.target.className.indexOf('rbt-close') !== -1;

      // Don't focus the input if it's disabled or the clear button was clicked.
      if (this.props.disabled || isClearButton) {
        e.target.blur();
        return;
      }

      this._input.focus();
      this.setState({isFocused: true});
    }

    _handleKeyDown = e => {
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

          const inputNode = findDOMNode(this._input);
          if (
            inputNode &&
            inputNode.contains(document.activeElement) &&
            !value
          ) {
            // If the input is selected and there is no text, select the last
            // token when the user hits backspace.
            const sibling = inputNode.parentElement.previousSibling;
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

          const cursorPos = this._input.selectionStart;
          const hintText = getHintText(this.props);

          // Autocomplete the selection if all of the following are true:
          if (
            this.state.isFocused &&
            // There's a hint or a menu item is highlighted.
            (hintText || activeItem) &&
            // There's no current selection.
            !selected.length &&
            // The input cursor is at the end of the text string when the user
            // hits the right arrow key.
            !(e.keyCode === RIGHT && cursorPos !== value.length) &&
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

  return WrappedInput;
}

export default typeaheadInputContainer;
