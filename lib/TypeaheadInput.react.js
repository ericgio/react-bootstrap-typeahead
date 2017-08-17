'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _head2 = require('lodash/head');

var _head3 = _interopRequireDefault(_head2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TextInput = require('./TextInput.react');

var _TextInput2 = _interopRequireDefault(_TextInput);

var _keyCode = require('./utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = function (_React$Component) {
  _inherits(TypeaheadInput, _React$Component);

  function TypeaheadInput(props) {
    _classCallCheck(this, TypeaheadInput);

    var _this = _possibleConstructorReturn(this, (TypeaheadInput.__proto__ || Object.getPrototypeOf(TypeaheadInput)).call(this, props));

    _this.displayName = 'TypeaheadInput';


    _this._handleBlur = _this._handleBlur.bind(_this);
    _this._handleChange = _this._handleChange.bind(_this);
    _this._handleInputFocus = _this._handleInputFocus.bind(_this);
    _this._handleKeydown = _this._handleKeydown.bind(_this);

    _this.state = {
      isFocused: false
    };
    return _this;
  }

  _createClass(TypeaheadInput, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _props = this.props,
          activeIndex = _props.activeIndex,
          value = _props.value;

      if (activeIndex !== prevProps.activeIndex) {
        this._input.getInstance().selectionStart = value.length;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

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
            return _this2._input = input;
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
    }
  }, {
    key: 'blur',
    value: function blur() {
      this._input.getInstance().blur();
    }
  }, {
    key: 'focus',
    value: function focus() {
      this._handleInputFocus();
    }
  }, {
    key: '_handleBlur',
    value: function _handleBlur(e) {
      this.setState({ isFocused: false });
      this.props.onBlur(e);
    }
  }, {
    key: '_handleChange',
    value: function _handleChange(e) {
      // Clear any selections when text is entered.
      var _props3 = this.props,
          onRemove = _props3.onRemove,
          selected = _props3.selected;

      !!selected.length && onRemove((0, _head3.default)(selected));

      this.props.onChange(e.target.value);
    }

    /**
     * If the containing parent div is focused or clicked, focus the input.
     */

  }, {
    key: '_handleInputFocus',
    value: function _handleInputFocus(e) {
      this.setState({ isFocused: true });
      this._input.getInstance().focus();
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(e) {
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
  }]);

  return TypeaheadInput;
}(_react2.default.Component);

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


TypeaheadInput.propTypes = {
  /**
   * Whether to disable the input and any selection, if present.
   */
  disabled: _propTypes2.default.bool,
  /**
   * Name property for the input.
   */
  name: _propTypes2.default.string,
  /**
   * Placeholder text for the input.
   */
  placeholder: _propTypes2.default.string
};

exports.default = TypeaheadInput;