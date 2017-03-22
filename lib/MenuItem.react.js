'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMenuItem = undefined;

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _menuItemContainer = require('./containers/menuItemContainer');

var _menuItemContainer2 = _interopRequireDefault(_menuItemContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseMenuItem = _react2.default.createClass({
  displayName: 'BaseMenuItem',

  getDefaultProps: function getDefaultProps() {
    return {
      onClick: _noop3.default
    };
  },
  render: function render() {
    var _props = this.props,
        active = _props.active,
        children = _props.children,
        className = _props.className,
        disabled = _props.disabled;


    return _react2.default.createElement(
      'li',
      {
        className: (0, _classnames2.default)({
          'active': active,
          'disabled': disabled
        }, className) },
      _react2.default.createElement(
        'a',
        { onTouchStart: this._handleClick, onClick: this._handleClick, role: 'button' },
        children
      )
    );
  },
  _handleClick: function _handleClick(e) {
    var _props2 = this.props,
        disabled = _props2.disabled,
        onClick = _props2.onClick;

    if (e.type === 'touchstart') {
      e.stopPropagation();
    } else {
      e.preventDefault();
    }

    !disabled && onClick(e);
  }
});

var MenuItem = (0, _menuItemContainer2.default)(BaseMenuItem);

exports.BaseMenuItem = BaseMenuItem;
exports.default = MenuItem;