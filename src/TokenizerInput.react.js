'use strict';

import AutosizeInput from 'react-input-autosize';
import React from 'react';
import Token from './Token.react';

import cx from 'classnames';
import {findDOMNode} from 'react-dom';
import keyCode from './keyCode';

const {PropTypes} = React;

require('../css/Tokenizer.css');

/**
 * TokenizerInput
 *
 * Accepts multiple selections from a Typeahead component and renders them as
 * tokens within an input.
 */
const TokenizerInput = React.createClass({
  displayName: 'TokenizerInput',

  propTypes: {
    disabled: PropTypes.bool,
    labelKey: PropTypes.string,
    /**
     * Input element placeholder text.
     */
    placeholder: PropTypes.string,
    selected: PropTypes.array,
  },

  render() {
    const {className, disabled, placeholder, selected, text} = this.props;

    return (
      <div
        className={cx(
          'bootstrap-tokenizer',
          'form-control',
          'clearfix',
          className
        )}
        disabled={disabled}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        tabIndex={disabled ? -1 : 0}>
        {selected.map(this._renderToken)}
        <AutosizeInput
          {...this.props}
          className="bootstrap-tokenizer-input"
          inputStyle={{
            backgroundColor: 'inherit',
            border: 0,
            cursor: 'inherit',
            outline: 'none',
            padding: 0,
          }}
          onKeyDown={this._handleKeydown}
          placeholder={selected.length ? null : placeholder}
          ref="input"
          type="text"
          value={text}
        />
      </div>
    );
  },

  _renderToken(option, idx) {
    const {disabled, labelKey, onRemove} = this.props;

    return (
      <Token
        disabled={disabled}
        key={idx}
        onRemove={onRemove.bind(null, option)}>
        {option[labelKey]}
      </Token>
    );
  },

  _handleKeydown: function(e) {
    switch (e.keyCode) {
      case keyCode.LEFT:
      case keyCode.RIGHT:
        // TODO: Tab forward and backward through tokens when user clicks left
        // or right arrow keys.
        break;
      case keyCode.BACKSPACE:
        let inputNode = findDOMNode(this.refs.input);
        if (
          inputNode &&
          inputNode.contains(document.activeElement) &&
          !this.props.text
        ) {
          // If the input is selected and there is no text, select the last
          // token when the user hits backspace.
          let sibling = inputNode.previousSibling;
          sibling && sibling.focus();
        }
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },

  _handleInputFocus: function(e, e2, e3) {
    if (this.props.disabled) {
      e.target.blur();
      return;
    }

    // If the user clicks anywhere inside the tokenizer besides a token,
    // focus the input.
    this.refs.input.focus();
  },
});

export default TokenizerInput;
