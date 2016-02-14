'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Token = require('./Token.react');

var _Token2 = _interopRequireDefault(_Token);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

var _keyCode = require('./keyCode');

var _keyCode2 = _interopRequireDefault(_keyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropTypes = _react2.default.PropTypes;

require('../css/Tokenizer.css');

/**
 * TokenizerInput
 *
 * Accepts multiple selections from a Typeahead component and renders them as
 * tokens within an input.
 */
var TokenizerInput = _react2.default.createClass({
  displayName: 'TokenizerInput',

  propTypes: {
    labelKey: PropTypes.string,
    /**
     * Input element placeholder text.
     */
    placeholder: PropTypes.string,
    selected: PropTypes.array
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var placeholder = _props.placeholder;
    var selected = _props.selected;
    var text = _props.text;

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-tokenizer', 'form-control', 'clearfix', className),
        onClick: this._handleInputFocus,
        onFocus: this._handleInputFocus,
        tabIndex: 0 },
      selected.map(this._renderToken),
      _react2.default.createElement(_reactInputAutosize2.default, _extends({}, this.props, {
        className: 'bootstrap-tokenizer-input',
        inputStyle: {
          backgroundColor: 'inherit',
          border: 0,
          outline: 'none',
          padding: 0
        },
        onKeyDown: this._handleKeydown,
        placeholder: selected.length ? null : placeholder,
        ref: 'input',
        type: 'text',
        value: text
      }))
    );
  },

  _renderToken: function _renderToken(option, idx) {
    var _props2 = this.props;
    var onRemove = _props2.onRemove;
    var labelKey = _props2.labelKey;

    return _react2.default.createElement(
      _Token2.default,
      {
        key: idx,
        onRemove: onRemove.bind(null, option) },
      option[labelKey]
    );
  },

  _handleKeydown: function _handleKeydown(e) {
    switch (e.keyCode) {
      case _keyCode2.default.LEFT:
      case _keyCode2.default.RIGHT:
        // TODO: Tab forward and backward through tokens when user clicks left
        // or right arrow keys.
        break;
      case _keyCode2.default.BACKSPACE:
        var inputNode = (0, _reactDom.findDOMNode)(this.refs.input);
        if (inputNode && inputNode.contains(document.activeElement) && !this.props.text) {
          // If the input is selected and there is no text, select the last
          // token when the user hits backspace.
          var sibling = inputNode.previousSibling;
          sibling && sibling.focus();
        }
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },

  _handleInputFocus: function _handleInputFocus(e) {
    // If the user clicks anywhere inside the tokenizer besides a token,
    // focus the input.
    this.refs.input.focus();
  }
});

module.exports = TokenizerInput;