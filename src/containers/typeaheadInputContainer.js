import {head} from 'lodash';
import * as React from 'react';
import {findDOMNode} from 'react-dom';

import {getHintText, getInputText} from '../utils/';

import {BACKSPACE, RETURN, RIGHT, TAB} from '../constants/keyCode';

function typeaheadInputContainer(Input) {
  class WrappedInput extends React.Component {
    state = {
      isFocused: false,
    };

    render() {
      const {placeholder, selected} = this.props;

      return (
        <Input
          {...this.props}
          {...this.state}
          hintText={getHintText(this.props)}
          inputRef={(input) => this._input = input}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onContainerClickOrFocus={this._handleContainerClickOrFocus}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeyDown}
          placeholder={selected.length ? null : placeholder}
          value={getInputText(this.props)}
        />
      );
    }

    getInputNode() {
      return this._input.getInput();
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

      onChange(e.target.value);
    }

    _handleFocus = (e) => {
      this.props.onFocus(e);
      this.setState({isFocused: true});
    }

    /**
     * Forward click or focus events on the container element to the input.
     */
    _handleContainerClickOrFocus = (e) => {
      // Don't focus the input if it's disabled.
      if (this.props.disabled) {
        e.target.blur();
        return;
      }

      // Move cursor to the end if the user clicks outside the actual input.
      const inputNode = this.getInputNode();
      if (e.target !== inputNode) {
        inputNode.selectionStart = inputNode.value.length;
      }

      inputNode.focus();
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

  return WrappedInput;
}

export default typeaheadInputContainer;
