'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _head2 = require('lodash/head');

var _head3 = _interopRequireDefault(_head2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextInput = require('./TextInput.react');

var _TextInput2 = _interopRequireDefault(_TextInput);

var _keyCode = require('./utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = _react2.default.createClass({
  displayName: 'TypeaheadInput',

  /**
   * In addition to the propTypes below, the following props are automatically
   * passed down by `Typeahead`:
   *
   *  - activeIndex
   *  - activeItem
   *  - hasAux
   *  - hintText
   *  - labelKey
   *  - onAdd
   *  - onBlur
   *  - onChange
   *  - onClick
   *  - onFocus
   *  - onKeydown
   *  - onRemove
   *  - selected
   *  - value
   */
  propTypes: {
    /**
     * Whether to disable the input and any selection, if present.
     */
    disabled: _react.PropTypes.bool,
    /**
     * Name property for the input.
     */
    name: _react.PropTypes.string,
    /**
     * Placeholder text for the input.
     */
    placeholder: _react.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      isFocused: false
    };
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _props = this.props,
        activeIndex = _props.activeIndex,
        value = _props.value;

    if (activeIndex !== prevProps.activeIndex) {
      this._input.getInstance().selectionStart = value.length;
    }
  },
  render: function render() {
    var _this = this;

    var _props2 = this.props,
        bsSize = _props2.bsSize,
        className = _props2.className,
        disabled = _props2.disabled,
        hasAux = _props2.hasAux,
        hintText = _props2.hintText,
        name = _props2.name,
        onFocus = _props2.onFocus,
        placeholder = _props2.placeholder,
        selected = _props2.selected,
        value = _props2.value;


    var inputProps = {
      bsSize: bsSize,
      disabled: disabled,
      hasAux: hasAux,
      name: name,
      onFocus: onFocus,
      placeholder: placeholder,
      value: value
    };

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-input', className),
        onClick: this._handleInputFocus,
        onFocus: this._handleInputFocus,
        style: {
          outline: 'none',
          position: 'relative'
        },
        tabIndex: -1 },
      _react2.default.createElement(_TextInput2.default, _extends({}, inputProps, {
        autoComplete: 'off',
        className: (0, _classnames2.default)('bootstrap-typeahead-input-main', {
          'has-selection': !!selected.length
        }),
        onBlur: this._handleBlur,
        onChange: this._handleChange,
        onKeyDown: this._handleKeydown,
        ref: function ref(input) {
          return _this._input = input;
        },
        style: {
          backgroundColor: !disabled && 'transparent',
          display: 'block',
          position: 'relative',
          zIndex: 1
        }
      })),
      _react2.default.createElement(_TextInput2.default, {
        bsSize: bsSize,
        className: (0, _classnames2.default)('bootstrap-typeahead-input-hint'),
        hasAux: hasAux,
        style: {
          borderColor: 'transparent',
          bottom: 0,
          boxShadow: 'none',
          color: '#a5a5a5',
          display: 'block',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0
        },
        tabIndex: -1,
        value: this.state.isFocused ? hintText : ''
      })
    );
  },
  blur: function blur() {
    this._input.getInstance().blur();
  },
  focus: function focus() {
    this._handleInputFocus();
  },
  _handleBlur: function _handleBlur(e) {
    this.setState({ isFocused: false });
    this.props.onBlur(e);
  },
  _handleChange: function _handleChange(e) {
    // Clear any selections when text is entered.
    var _props3 = this.props,
        onRemove = _props3.onRemove,
        selected = _props3.selected;

    !!selected.length && onRemove((0, _head3.default)(selected));

    this.props.onChange(e.target.value);
  },


  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus: function _handleInputFocus(e) {
    this.setState({ isFocused: true });
    this._input.getInstance().focus();
  },
  _handleKeydown: function _handleKeydown(e) {
    var _props4 = this.props,
        activeItem = _props4.activeItem,
        hintText = _props4.hintText,
        initialItem = _props4.initialItem,
        onAdd = _props4.onAdd,
        selected = _props4.selected,
        value = _props4.value;


    switch (e.keyCode) {
      case _keyCode.RIGHT:
      case _keyCode.TAB:
        var cursorPos = this._input.getInstance().selectionStart;

        // Autocomplete the selection if all of the following are true:
        if (this.state.isFocused && (
        // There's a hint or a menu item is highlighted.
        hintText || activeItem) &&
        // There's no current selection.
        !selected.length &&
        // The input cursor is at the end of the text string when the user
        // hits the right arrow key.
        !(e.keyCode === _keyCode.RIGHT && cursorPos !== value.length)) {
          e.preventDefault();

          var selectedOption = hintText ? initialItem : activeItem;

          onAdd && onAdd(selectedOption);
        }
        break;
    }

    this.props.onKeyDown(e);
  }
});

exports.default = TypeaheadInput;