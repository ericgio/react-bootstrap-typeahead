'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tokenContainer = require('./containers/tokenContainer');

var _tokenContainer2 = _interopRequireDefault(_tokenContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
var Token = function (_React$Component) {
  _inherits(Token, _React$Component);

  function Token() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Token);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Token.__proto__ || Object.getPrototypeOf(Token)).call.apply(_ref, [this].concat(args))), _this), _this.displayName = 'Token', _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Token, [{
    key: 'render',
    value: function render() {
      return this.props.onRemove && !this.props.disabled ? this._renderRemoveableToken() : this._renderToken();
    }
  }, {
    key: '_renderRemoveableToken',
    value: function _renderRemoveableToken() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          onRemove = _props.onRemove,
          selected = _props.selected,
          otherProps = _objectWithoutProperties(_props, ['children', 'className', 'onRemove', 'selected']);

      return _react2.default.createElement(
        'div',
        _extends({}, otherProps, {
          className: (0, _classnames2.default)('token', 'token-removeable', {
            'token-selected': selected
          }, className),
          tabIndex: 0 }),
        children,
        _react2.default.createElement(
          'span',
          {
            className: 'close-button',
            onClick: onRemove,
            role: 'button' },
          '\xD7'
        )
      );
    }
  }, {
    key: '_renderToken',
    value: function _renderToken() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          disabled = _props2.disabled,
          href = _props2.href;

      var classnames = (0, _classnames2.default)('token', { 'token-disabled': disabled }, className);

      if (href) {
        return _react2.default.createElement(
          'a',
          { className: classnames, href: href },
          children
        );
      }

      return _react2.default.createElement(
        'div',
        { className: classnames },
        children
      );
    }
  }]);

  return Token;
}(_react2.default.Component);

Token.propTypes = {
  /**
   * Handler for removing/deleting the token. If not defined, the token will
   * be rendered in a read-only state.
   */
  onRemove: _propTypes2.default.func,
  selected: _propTypes2.default.bool
};

Token.defaultProps = {
  onRemove: _noop3.default,
  selected: false
};

exports.default = (0, _tokenContainer2.default)(Token);