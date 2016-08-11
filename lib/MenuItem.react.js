'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _scrollIntoViewIfNeeded = require('./scrollIntoViewIfNeeded');

var _scrollIntoViewIfNeeded2 = _interopRequireDefault(_scrollIntoViewIfNeeded);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuItem = _react2.default.createClass({
  displayName: 'MenuItem',

  getDefaultProps: function getDefaultProps() {
    return {
      onClick: _noop3.default
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      // Ensures that if the menu items exceed the bounds of the menu, the
      // menu will scroll up or down as the user hits the arrow keys.
      (0, _scrollIntoViewIfNeeded2.default)((0, _reactDom.findDOMNode)(this));
    }
  },
  render: function render() {
    var _props = this.props;
    var active = _props.active;
    var children = _props.children;
    var className = _props.className;
    var disabled = _props.disabled;


    return _react2.default.createElement(
      'li',
      {
        className: (0, _classnames2.default)({
          'active': active,
          'disabled': disabled
        }, className) },
      _react2.default.createElement(
        'a',
        { href: '#', onClick: this._handleClick },
        children
      )
    );
  },
  _handleClick: function _handleClick(e) {
    var _props2 = this.props;
    var disabled = _props2.disabled;
    var onClick = _props2.onClick;


    e.preventDefault();
    !disabled && onClick(e);
  }
});

exports.default = MenuItem;