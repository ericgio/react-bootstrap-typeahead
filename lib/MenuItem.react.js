'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMenuItem = undefined;

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _menuItemContainer = require('./containers/menuItemContainer');

var _menuItemContainer2 = _interopRequireDefault(_menuItemContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseMenuItem = function (_React$Component) {
  _inherits(BaseMenuItem, _React$Component);

  function BaseMenuItem(props) {
    _classCallCheck(this, BaseMenuItem);

    var _this = _possibleConstructorReturn(this, (BaseMenuItem.__proto__ || Object.getPrototypeOf(BaseMenuItem)).call(this, props));

    _this.displayName = 'BaseMenuItem';


    _this._handleClick = _this._handleClick.bind(_this);
    return _this;
  }

  _createClass(BaseMenuItem, [{
    key: 'render',
    value: function render() {
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
          { onClick: this._handleClick, role: 'button' },
          children
        )
      );
    }
  }, {
    key: '_handleClick',
    value: function _handleClick(e) {
      var _props2 = this.props,
          disabled = _props2.disabled,
          onClick = _props2.onClick;


      e.preventDefault();
      !disabled && onClick(e);
    }
  }]);

  return BaseMenuItem;
}(_react2.default.Component);

BaseMenuItem.defaultProps = {
  onClick: _noop3.default
};

var MenuItem = (0, _menuItemContainer2.default)(BaseMenuItem);

exports.BaseMenuItem = BaseMenuItem;
exports.default = MenuItem;