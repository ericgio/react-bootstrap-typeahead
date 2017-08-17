'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _getDisplayName = require('../utils/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _keyCode = require('../utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
var tokenContainer = function tokenContainer(Component) {
  var WrappedComponent = function (_React$Component) {
    _inherits(WrappedComponent, _React$Component);

    function WrappedComponent(props) {
      _classCallCheck(this, WrappedComponent);

      var _this = _possibleConstructorReturn(this, (WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call(this, props));

      _this.displayName = 'tokenContainer(' + (0, _getDisplayName2.default)(Component) + ')';


      _this._handleBlur = _this._handleBlur.bind(_this);
      _this._handleKeyDown = _this._handleKeyDown.bind(_this);
      _this._handleRemove = _this._handleRemove.bind(_this);
      _this._handleSelect = _this._handleSelect.bind(_this);
      _this.handleClickOutside = _this.handleClickOutside.bind(_this);

      _this.state = {
        selected: false
      };
      return _this;
    }

    _createClass(WrappedComponent, [{
      key: 'render',
      value: function render() {
        var tokenProps = (0, _omit3.default)(this.props, ['disableOnClickOutside', 'enableOnClickOutside']);

        return _react2.default.createElement(Component, _extends({}, tokenProps, this.state, {
          onBlur: this._handleBlur,
          onClick: this._handleSelect,
          onFocus: this._handleSelect,
          onKeyDown: this._handleKeyDown
        }));
      }
    }, {
      key: '_handleBlur',
      value: function _handleBlur(e) {
        (0, _reactDom.findDOMNode)(this).blur();
        this.setState({ selected: false });
        this.props.disableOnClickOutside && this.props.disableOnClickOutside();
      }
    }, {
      key: '_handleKeyDown',
      value: function _handleKeyDown(e) {
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
      }

      /**
       * From `onClickOutside` HOC.
       */

    }, {
      key: 'handleClickOutside',
      value: function handleClickOutside(e) {
        this._handleBlur();
      }
    }, {
      key: '_handleRemove',
      value: function _handleRemove(e) {
        this.props.onRemove && this.props.onRemove();
      }
    }, {
      key: '_handleSelect',
      value: function _handleSelect(e) {
        e.stopPropagation();
        this.setState({ selected: true });
        this.props.enableOnClickOutside && this.props.enableOnClickOutside();
      }
    }]);

    return WrappedComponent;
  }(_react2.default.Component);

  return (0, _reactOnclickoutside2.default)(WrappedComponent);
};

exports.default = tokenContainer;