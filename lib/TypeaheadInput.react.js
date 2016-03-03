'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _keyCode = require('./keyCode');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropTypes = _react2.default.PropTypes;

require('../css/Typeahead.css');

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = _react2.default.createClass({
  displayName: 'TypeaheadInput',

  mixins: [_reactOnclickoutside2.default],

  propTypes: {
    filteredOptions: PropTypes.array,
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.object,
    text: PropTypes.string
  },

  render: function render() {
    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-input', this.props.className),
        onClick: this._handleInputFocus,
        onFocus: this._handleInputFocus,
        tabIndex: 0 },
      _react2.default.createElement('input', _extends({}, this.props, {
        className: (0, _classnames2.default)('bootstrap-typeahead-input-main', 'form-control', {
          'has-selection': !this.props.selected
        }),
        onKeyDown: this._handleKeydown,
        ref: 'input',
        style: {
          backgroundColor: 'transparent',
          display: 'block',
          position: 'relative',
          zIndex: 1
        },
        type: 'text',
        value: this._getInputValue()
      })),
      _react2.default.createElement('input', {
        className: 'bootstrap-typeahead-input-hint form-control',
        style: {
          borderColor: 'transparent',
          bottom: 0,
          display: 'block',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0
        },
        value: this._getHintText()
      })
    );
  },
  _getInputValue: function _getInputValue() {
    var _props = this.props;
    var labelKey = _props.labelKey;
    var selected = _props.selected;
    var text = _props.text;

    return selected ? selected[labelKey] : text;
  },
  _getHintText: function _getHintText() {
    var _props2 = this.props;
    var filteredOptions = _props2.filteredOptions;
    var labelKey = _props2.labelKey;
    var text = _props2.text;

    var firstOption = (0, _lodash.head)(filteredOptions);

    // Only show the hint if...
    if (
    // ...the input is focused.
    this.refs.input === document.activeElement &&
    // ...the input contains text.
    text &&
    // ...the input text corresponds to the beginning of the first option.
    firstOption && firstOption[labelKey].indexOf(text) === 0) {
      return firstOption[labelKey];
    }
  },

  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus: function _handleInputFocus(e) {
    this.refs.input.focus();
  },

  _handleKeydown: function _handleKeydown(e) {
    var _props3 = this.props;
    var filteredOptions = _props3.filteredOptions;
    var onAdd = _props3.onAdd;
    var onRemove = _props3.onRemove;
    var selected = _props3.selected;

    switch (e.keyCode) {
      case _keyCode2.default.ESC:
        this.refs.input.blur();
        break;
      case _keyCode2.default.RIGHT:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected) {
          onAdd && onAdd((0, _lodash.head)(filteredOptions));
        }
        break;
      case _keyCode2.default.BACKSPACE:
        // Remove the selection if we start deleting it.
        selected && onRemove && onRemove(selected);
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },

  handleClickOutside: function handleClickOutside(e) {
    // Force blur so that input is no longer the active element. For some
    // reason, it's taking 2 clicks to fully blur the input otherwise.
    this.refs.input.blur();
  }
});

exports.default = TypeaheadInput;