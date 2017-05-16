'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MenuItem = require('./MenuItem.react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseMenu = function BaseMenu(props) {
  return _react2.default.createElement(
    'ul',
    _extends({}, props, {
      className: (0, _classnames2.default)('dropdown-menu', props.className) }),
    props.children
  );
};

/**
 * Menu component that automatically handles pagination and empty state when
 * passed a set of filtered and truncated results.
 */

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Menu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Menu.__proto__ || Object.getPrototypeOf(Menu)).call.apply(_ref, [this].concat(args))), _this), _this.displayName = 'Menu', _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Menu, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          align = _props.align,
          children = _props.children,
          className = _props.className,
          emptyLabel = _props.emptyLabel;

      var noResults = _react.Children.count(children) === 0;

      // If an empty string is passed, suppress menu when there are no results.
      if (noResults && emptyLabel === '') {
        return null;
      }

      var contents = noResults ? _react2.default.createElement(
        _MenuItem.BaseMenuItem,
        { disabled: true },
        emptyLabel
      ) : children;

      return _react2.default.createElement(
        BaseMenu,
        {
          className: (0, _classnames2.default)('bootstrap-typeahead-menu', {
            'dropdown-menu-justify': align === 'justify',
            'dropdown-menu-right': align === 'right'
          }, className),
          style: this._getMenuStyle() },
        contents,
        this._renderPaginationMenuItem()
      );
    }

    /**
     * Allow user to see more results, if available.
     */

  }, {
    key: '_renderPaginationMenuItem',
    value: function _renderPaginationMenuItem() {
      var _props2 = this.props,
          children = _props2.children,
          onPaginate = _props2.onPaginate,
          paginate = _props2.paginate,
          paginationText = _props2.paginationText;


      if (paginate && _react.Children.count(children)) {
        return [_react2.default.createElement('li', {
          className: 'divider',
          key: 'pagination-item-divider',
          role: 'separator'
        }), _react2.default.createElement(
          _MenuItem.BaseMenuItem,
          {
            className: 'bootstrap-typeahead-menu-paginator',
            key: 'pagination-item',
            onClick: onPaginate },
          paginationText
        )];
      }
    }
  }, {
    key: '_getMenuStyle',
    value: function _getMenuStyle() {
      var _props3 = this.props,
          align = _props3.align,
          dropup = _props3.dropup,
          maxHeight = _props3.maxHeight,
          style = _props3.style;

      var menuStyle = _extends({}, style, {
        display: 'block',
        maxHeight: maxHeight + 'px',
        overflow: 'auto'
      });

      if (style) {
        if (dropup) {
          menuStyle.top = 'auto';
        } else {
          delete menuStyle.bottom;
        }
        menuStyle.left = align === 'right' ? 'auto' : style.left;
        menuStyle.right = align === 'left' ? 'auto' : style.right;
      }

      return menuStyle;
    }
  }]);

  return Menu;
}(_react2.default.Component);

Menu.PropTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: _propTypes2.default.oneOf(['justify', 'left', 'right']),
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: _propTypes2.default.string,
  /**
   * Maximum height of the dropdown menu, in px.
   */
  maxHeight: _propTypes2.default.number,
  /**
   * Prompt displayed when large data sets are paginated.
   */
  paginationText: _propTypes2.default.string
};

Menu.defaultProps = {
  align: 'justify',
  emptyLabel: 'No matches found.',
  maxHeight: 300,
  paginate: true,
  paginationText: 'Display additional results...'
};

exports.default = Menu;