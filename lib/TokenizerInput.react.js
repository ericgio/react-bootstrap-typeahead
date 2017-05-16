'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _Token = require('./Token.react');

var _Token2 = _interopRequireDefault(_Token);

var _getOptionLabel = require('./utils/getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

var _keyCode = require('./utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * TokenizerInput
 *
 * Accepts multiple selections from a Typeahead component and renders them as
 * tokens within an input.
 */
var TokenizerInput = function (_React$Component) {
  _inherits(TokenizerInput, _React$Component);

  function TokenizerInput(props) {
    _classCallCheck(this, TokenizerInput);

    var _this = _possibleConstructorReturn(this, (TokenizerInput.__proto__ || Object.getPrototypeOf(TokenizerInput)).call(this, props));

    _this.displayName = 'TokenizerInput';


    _this._handleBlur = _this._handleBlur.bind(_this);
    _this._handleChange = _this._handleChange.bind(_this);
    _this._handleInputFocus = _this._handleInputFocus.bind(_this);
    _this._handleKeydown = _this._handleKeydown.bind(_this);
    _this._renderToken = _this._renderToken.bind(_this);

    _this.state = {
      isFocused: false
    };
    return _this;
  }

  _createClass(TokenizerInput, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          bsSize = _props.bsSize,
          disabled = _props.disabled,
          hasAux = _props.hasAux,
          placeholder = _props.placeholder,
          selected = _props.selected,
          value = _props.value;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('bootstrap-tokenizer', 'clearfix', 'form-control', {
            'focus': this.state.isFocused,
            'has-aux': hasAux,
            'input-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm': bsSize === 'small' || bsSize === 'sm'
          }),
          disabled: disabled,
          onClick: this._handleInputFocus,
          onFocus: this._handleInputFocus,
          style: {
            cursor: 'text',
            height: 'auto'
          },
          tabIndex: -1 },
        selected.map(this._renderToken),
        _react2.default.createElement(_reactInputAutosize2.default, {
          className: 'bootstrap-tokenizer-input',
          disabled: disabled,
          inputClassName: 'bootstrap-typeahead-input-main',
          inputStyle: {
            backgroundColor: 'inherit',
            border: 0,
            boxShadow: 'none',
            cursor: 'inherit',
            outline: 'none',
            padding: 0
          },
          onBlur: this._handleBlur,
          onChange: this._handleChange,
          onFocus: this.props.onFocus,
          onKeyDown: this._handleKeydown,
          placeholder: selected.length ? null : placeholder,
          ref: 'input',
          type: 'text',
          value: value
        })
      );
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.refs.input.blur();
    }
  }, {
    key: 'focus',
    value: function focus() {
      this._handleInputFocus();
    }
  }, {
    key: '_renderToken',
    value: function _renderToken(option, idx) {
      var _props2 = this.props,
          disabled = _props2.disabled,
          labelKey = _props2.labelKey,
          onRemove = _props2.onRemove,
          renderToken = _props2.renderToken;

      var onRemoveWrapped = function onRemoveWrapped() {
        return onRemove(option);
      };

      if (renderToken) {
        return renderToken(option, onRemoveWrapped, idx);
      }

      return _react2.default.createElement(
        _Token2.default,
        {
          disabled: disabled,
          key: idx,
          onRemove: onRemoveWrapped },
        (0, _getOptionLabel2.default)(option, labelKey)
      );
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
      this.props.onChange(e.target.value);
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(e) {
      switch (e.keyCode) {
        case _keyCode.BACKSPACE:
          var inputNode = (0, _reactDom.findDOMNode)(this.refs.input);
          if (inputNode && inputNode.contains(document.activeElement) && !this.props.value) {
            // If the input is selected and there is no text, select the last
            // token when the user hits backspace.
            var sibling = inputNode.previousSibling;
            sibling && sibling.focus();

            // Prevent browser "back" action.
            e.preventDefault();
          }
          break;
      }

      this.props.onKeyDown(e);
    }
  }, {
    key: '_handleInputFocus',
    value: function _handleInputFocus(e) {
      if (this.props.disabled) {
        e.target.blur();
        return;
      }

      // If the user clicks anywhere inside the tokenizer besides a token,
      // focus the input.
      this.refs.input.focus();
      this.setState({ isFocused: true });
    }
  }]);

  return TokenizerInput;
}(_react2.default.Component);

/**
 * In addition to the propTypes below, the following props are automatically
 * passed down by `Typeahead`:
 *
 *  - activeIndex
 *  - hasAux
 *  - labelKey
 *  - onAdd
 *  - onBlur
 *  - onChange
 *  - onClick
 *  - onFocus
 *  - onKeydown
 *  - onRemove
 *  - options
 *  - selected
 *  - value
 */


TokenizerInput.propTypes = {
  /**
   * Whether to disable the input and all selections.
   */
  disabled: _propTypes2.default.bool,
  /**
   * Placeholder text for the input.
   */
  placeholder: _propTypes2.default.string,
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: _propTypes2.default.func
};

exports.default = TokenizerInput;