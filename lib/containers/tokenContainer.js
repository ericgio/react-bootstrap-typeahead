'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _getDisplayName = require('../utils/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _keyCode = require('../utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
var tokenContainer = function tokenContainer(Component) {
  var WrappedComponent = _react2.default.createClass({
    displayName: 'tokenContainer(' + (0, _getDisplayName2.default)(Component) + ')',

    getInitialState: function getInitialState() {
      return {
        selected: false
      };
    },
    render: function render() {
      var tokenProps = (0, _omit3.default)(this.props, ['disableOnClickOutside', 'enableOnClickOutside']);

      return _react2.default.createElement(Component, _extends({}, tokenProps, this.state, {
        onBlur: this._handleBlur,
        onClick: this._handleSelect,
        onFocus: this._handleSelect,
        onKeyDown: this._handleKeyDown
      }));
    },
    _handleBlur: function _handleBlur(e) {
      (0, _reactDom.findDOMNode)(this).blur();
      this.setState({ selected: false });
      this.props.disableOnClickOutside && this.props.disableOnClickOutside();
    },
    _handleKeyDown: function _handleKeyDown(e) {
      switch (e.keyCode) {
        case _keyCode.BACKSPACE:
          if (this.state.selected) {
            // Prevent backspace keypress from triggering the browser "back"
            // action.
            e.preventDefault();
            this._handleRemove();
          }
          break;
      }
    },


    /**
     * From `onClickOutside` HOC.
     */
    handleClickOutside: function handleClickOutside(e) {
      this._handleBlur();
    },
    _handleRemove: function _handleRemove(e) {
      this.props.onRemove && this.props.onRemove();
    },
    _handleSelect: function _handleSelect(e) {
      e.stopPropagation();
      this.setState({ selected: true });
      this.props.enableOnClickOutside && this.props.enableOnClickOutside();
    }
  });

  return (0, _reactOnclickoutside2.default)(WrappedComponent);
};

exports.default = tokenContainer;