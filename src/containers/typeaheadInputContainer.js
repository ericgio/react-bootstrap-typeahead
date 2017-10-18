import {head} from 'lodash';
import React from 'react';
import {findDOMNode} from 'react-dom';

import getHintText from '../utils/getHintText';
import getInputText from '../utils/getInputText';

import {BACKSPACE, RETURN, RIGHT, SPACE, TAB} from '../utils/keyCode';

function typeaheadInputContainer(Input) {
  class WrappedInput extends React.Component {
    state = {
      cursorPos: null,
    };

    componentDidUpdate(prevProps, prevState) {
      const inputNode = this.getInputNode();
      const {cursorPos} = this.state;

      if (
        inputNode.value === this.props.text &&
        cursorPos != null &&
        inputNode.selectionStart !== cursorPos
      ) {
        inputNode.selectionStart = inputNode.selectionEnd = cursorPos;
        this.setState({cursorPos: null});
      }

      if (cursorPos === 0) {
        this.setState({cursorPos: null});
      }
    }

    render() {
      const {placeholder, selected} = this.props;

      return (
        <Input
          {...this.props}
          {...this.state}
          hintText={getHintText(this.props)}
          inputRef={input => this._input = input}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          placeholder={selected.length ? null : placeholder}
          value={getInputText(this.props)}
        />
      );
    }

    getInputNode() {
      return this._input.getInput();
    }

    _handleChange = e => {
      const {multiple, onChange, onRemove, selected} = this.props;

      if (!multiple) {
        // Clear any selections when text is entered.
        !!selected.length && onRemove(head(selected));
      }

      onChange(e.target.value);
    }

    _handleKeyDown = e => {
      const {
        activeItem,
        initialItem,
        isFocused,
        multiple,
        onAdd,
        selected,
        selectHintOnEnter,
      } = this.props;

      const inputNode = e.target;
      const cursorPos = inputNode.selectionStart;
      const value = getInputText(this.props);

      switch (e.keyCode) {
        case BACKSPACE:
          // Manage cursor state so it doesn't jump around.
          setTimeout(() => {
            this.setState({cursorPos: cursorPos === 0 ? null : cursorPos - 1});
          }, 0);

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

          // Autocomplete the selection if all of the following are true:
          if (
            isFocused &&
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
            this.setState({cursorPos: null});
          }
          break;
        default:
          // Handle typeable characters.
          if (
            // Numbers
            (e.keyCode > 47 && e.keyCode < 58) ||
            // Letters
            (e.keyCode > 64 && e.keyCode < 91) ||
            // Number pad
            (e.keyCode > 95 && e.keyCode < 112) ||
            // ;=,-./`
            (e.keyCode > 185 && e.keyCode < 193) ||
            // [\]'
            (e.keyCode > 218 && e.keyCode < 223) ||
            // Spacebar
            e.keyCode === SPACE
          ) {
            setTimeout(() => {
              this.setState({cursorPos: cursorPos + 1});
            }, 0);
          }
          break;
      }

      this.props.onKeyDown(e);
    }
  }

  return WrappedInput;
}

export default typeaheadInputContainer;
