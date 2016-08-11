'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _head2 = require('lodash/head');

var _head3 = _interopRequireDefault(_head2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _keyCode = require('./keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = _react2.default.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    disabled: _react.PropTypes.bool,
    labelKey: _react.PropTypes.string,
    name: _react.PropTypes.string,
    onBlur: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    onFocus: _react.PropTypes.func,
    options: _react.PropTypes.array,
    placeholder: _react.PropTypes.string,
    selected: _react.PropTypes.array,
    text: _react.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      isFocused: false
    };
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (this.props.activeIndex !== prevProps.activeIndex) {
      var inputText = this._getInputText();
      this.refs.input.selectionStart = inputText.length;
    }
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var disabled = _props.disabled;
    var selected = _props.selected;

    var inputProps = (0, _pick3.default)(this.props, ['disabled', 'name', 'onFocus', 'placeholder']);

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-input', className),
        onClick: this._handleInputFocus,
        onFocus: this._handleInputFocus,
        style: { outline: 'none' },
        tabIndex: -1 },
      _react2.default.createElement('input', _extends({}, inputProps, {
        className: (0, _classnames2.default)('bootstrap-typeahead-input-main', 'form-control', {
          'has-selection': !!selected.length
        }),
        onBlur: this._handleBlur,
        onChange: this._handleChange,
        onKeyDown: this._handleKeydown,
        ref: 'input',
        style: {
          backgroundColor: !disabled && 'transparent',
          display: 'block',
          position: 'relative',
          zIndex: 1
        },
        type: 'text',
        value: this._getInputText()
      })),
      _react2.default.createElement('input', {
        className: 'bootstrap-typeahead-input-hint form-control',
        style: {
          borderColor: 'transparent',
          bottom: 0,
          boxShadow: 'none',
          display: 'block',
          opacity: 0.6,
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0
        },
        tabIndex: -1,
        type: 'text',
        value: this._getHintText()
      })
    );
  },
  blur: function blur() {
    this.refs.input.blur();
  },
  focus: function focus() {
    this._handleInputFocus();
  },
  _getHintText: function _getHintText() {
    var _props2 = this.props;
    var activeIndex = _props2.activeIndex;
    var options = _props2.options;
    var labelKey = _props2.labelKey;
    var selected = _props2.selected;
    var text = _props2.text;

    var firstOption = (0, _head3.default)(options);
    var firstOptionString = firstOption && firstOption[labelKey];

    // Only show the hint if:
    if (
    // The input is focused.
    this.state.isFocused &&
    // The input contains text.
    text &&
    // None of the menu options are focused.
    activeIndex === -1 &&
    // There are no current selections.
    !selected.length &&
    // The input text corresponds to the beginning of the first option.
    firstOptionString && firstOptionString.toLowerCase().indexOf(text.toLowerCase()) === 0) {
      // Text matching is case-insensitive, so to display the hint correctly,
      // splice the input text with the rest of the actual string.
      return text + firstOptionString.slice(text.length, firstOptionString.length);
    }

    return '';
  },
  _getInputText: function _getInputText() {
    var _props3 = this.props;
    var activeIndex = _props3.activeIndex;
    var labelKey = _props3.labelKey;
    var options = _props3.options;
    var selected = _props3.selected;
    var text = _props3.text;


    var selectedItem = !!selected.length && (0, _head3.default)(selected);
    if (selectedItem) {
      return selectedItem[labelKey];
    }

    if (activeIndex >= 0) {
      return options[activeIndex][labelKey];
    }

    return text;
  },
  _handleBlur: function _handleBlur(e) {
    this.setState({ isFocused: false });
    this.props.onBlur(e);
  },
  _handleChange: function _handleChange(e) {
    // Clear any selections when text is entered.
    var _props4 = this.props;
    var onRemove = _props4.onRemove;
    var selected = _props4.selected;

    !!selected.length && onRemove((0, _head3.default)(selected));

    this.props.onChange(e.target.value);
  },


  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus: function _handleInputFocus(e) {
    this.setState({ isFocused: true });
    this.refs.input.focus();
  },
  _handleKeydown: function _handleKeydown(e) {
    var _props5 = this.props;
    var activeIndex = _props5.activeIndex;
    var options = _props5.options;
    var onAdd = _props5.onAdd;
    var selected = _props5.selected;
    var text = _props5.text;


    switch (e.keyCode) {
      case _keyCode.RIGHT:
      case _keyCode.TAB:
        var cursorPos = this.refs.input.selectionStart;
        var hasHintText = !!this._getHintText();

        // Autocomplete the selection if all of the following are true:
        if (
        // There's a hint or a menu item is highlighted.
        (hasHintText || activeIndex !== -1) &&
        // There's no current selection.
        !selected.length &&
        // The input cursor is at the end of the text string when the user
        // hits the right arrow key.
        !(e.keyCode === _keyCode.RIGHT && cursorPos !== text.length)) {
          e.preventDefault();

          var selectedOption = hasHintText ? (0, _head3.default)(options) : options[activeIndex];

          onAdd && onAdd(selectedOption);
        }
        break;
    }

    this.props.onKeyDown(e);
  }
});

exports.default = TypeaheadInput;