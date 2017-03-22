'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MenuItem = require('./MenuItem.react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var Menu = _react2.default.createClass({
  displayName: 'Menu',

  propTypes: {
    /**
     * Specify menu alignment. The default value is `justify`, which makes the
     * menu as wide as the input and truncates long values. Specifying `left`
     * or `right` will align the menu to that side and the width will be
     * determined by the length of menu item values.
     */
    align: _react.PropTypes.oneOf(['justify', 'left', 'right']),
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: _react.PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: _react.PropTypes.number,
    /**
     * Prompt displayed when large data sets are paginated.
     */
    paginationText: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      maxHeight: 300,
      paginate: true,
      paginationText: 'Display additional results...'
    };
  },
  render: function render() {
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
  },


  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem: function _renderPaginationMenuItem() {
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
  },
  _getMenuStyle: function _getMenuStyle() {
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
});

exports.default = Menu;