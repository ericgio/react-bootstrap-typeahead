import AutosizeInput from 'react-input-autosize';
import MenuItem from './MenuItem.react';
import React from 'react';
import Token from './Token.react';

import cx from 'classnames';
import {findDOMNode} from 'react-dom';
import keyCode from './keyCode';
import {map} from 'lodash/collection';

let {cloneElement, PropTypes} = React;

require('./css/Tokenizer.css');

/**
 * TokenizerInput
 *
 * Accepts multiple selections from a Typeahead component and renders them as
 * tokens within an input.
 */
var TokenizerInput = React.createClass({
  displayName: 'TokenizerInput',

  propTypes: {
    /**
     * Pass a custom token element to handle special rendering or behavior.
     */
    customToken: PropTypes.element,
    /**
     * Input element placeholder text.
     */
    placeholder: React.PropTypes.string,
    selected: PropTypes.array,
  },

  render: function() {
    var {className, placeholder, selected, text} = this.props;

    return (
      <div
        className={cx(
          'bootstrap-tokenizer',
          'form-control',
          'clearfix',
          className
        )}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        tabIndex={0}>
        {map(selected, this._renderToken)}
        <AutosizeInput
          {...this.props}
          className="bootstrap-tokenizer-input"
          onKeyDown={this._handleKeydown}
          placeholder={selected.length ? null : placeholder}
          ref={(ref) => this._input = ref}
          type="text"
          value={text}
        />
      </div>
    );
  },

  _renderToken: function(option, idx) {
    var {customToken, onRemove, labelKey} = this.props;

    // Use custom token element if available.
    return cloneElement(customToken || <Token />, {
      key: idx,
      onRemove: onRemove.bind(null, option),
    }, option[labelKey]);
  },

  _handleKeydown: function(e) {
    switch (e.keyCode) {
      case keyCode.LEFT:
      case keyCode.RIGHT:
        // TODO: Tab forward and backward through tokens when user clicks left
        // or right arrow keys.
        break;
      case keyCode.BACKSPACE:
        var inputNode = findDOMNode(this._input);
        if (
          inputNode &&
          inputNode.contains(document.activeElement) &&
          !this.props.text
        ) {
          // If the input is selected and there is no text, select the last
          // token when the user hits backspace.
          var sibling = inputNode.previousSibling;
          sibling && sibling.focus();
        }
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },

  _handleInputFocus: function(e) {
    // If the user clicks anywhere inside the tokenizer besides a token,
    // focus the input.
    this._input.focus();
  },
});

module.exports = TokenizerInput;
