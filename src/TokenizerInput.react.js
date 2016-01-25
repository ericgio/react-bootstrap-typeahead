var AutosizeInput = require('react-input-autosize');
var React = require('react');
var Token = require('./Token.react');

var cx = require('classnames');
var {findDOMNode} = require('react-dom');
var keyCode = require('./keyCode');
var {map} = require('lodash');

var {cloneElement, PropTypes} = React;

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
    labelKey: PropTypes.string,
    /**
     * Input element placeholder text.
     */
    placeholder: PropTypes.string,
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
        {selected.map(this._renderToken)}
        <AutosizeInput
          {...this.props}
          className="bootstrap-tokenizer-input"
          inputStyle={{
            backgroundColor: 'inherit',
            border: 0,
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

  _renderToken: function(option, idx) {
    var {onRemove, labelKey} = this.props;

    return (
      <Token
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
        var inputNode = findDOMNode(this.refs.input);
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
    this.refs.input.focus();
  },
});

module.exports = TokenizerInput;
