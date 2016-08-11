'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactHighlighter = require('react-highlighter');

var _reactHighlighter2 = _interopRequireDefault(_reactHighlighter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Menu = require('./Menu.react');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('./MenuItem.react');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TypeaheadMenu = _react2.default.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    activeIndex: _react.PropTypes.number,
    align: _react.PropTypes.oneOf(['justify', 'left', 'right']),
    emptyLabel: _react.PropTypes.string,
    initialResultCount: _react.PropTypes.number,
    labelKey: _react.PropTypes.string.isRequired,
    maxHeight: _react.PropTypes.number,
    newSelectionPrefix: _react.PropTypes.string,
    options: _react.PropTypes.array,
    paginationText: _react.PropTypes.string,
    renderMenuItemChildren: _react.PropTypes.func,
    text: _react.PropTypes.string.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      initialResultCount: 100,
      maxHeight: 300,
      newSelectionPrefix: 'New selection: ',
      paginationText: 'Display additional results...'
    };
  },
  getInitialState: function getInitialState() {
    return {
      /**
       * Max number of results to display, for performance reasons. If this
       * number is less than the number of available results, the user will see
       * an option to display more results.
       */
      resultCount: this.props.initialResultCount
    };
  },
  render: function render() {
    var _props = this.props;
    var align = _props.align;
    var emptyLabel = _props.emptyLabel;
    var maxHeight = _props.maxHeight;
    var options = _props.options;

    // Render the max number of results or all results.

    var results = options.slice(0, this.state.resultCount || options.length);
    var menuItems = results.length ? results.map(this._renderMenuItem) : _react2.default.createElement(
      _MenuItem2.default,
      { disabled: true },
      emptyLabel
    );

    return _react2.default.createElement(
      _Menu2.default,
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right'
        }),
        style: {
          maxHeight: maxHeight + 'px',
          overflow: 'auto'
        } },
      menuItems,
      this._renderPaginationMenuItem(results)
    );
  },
  _renderMenuItem: function _renderMenuItem(option, idx) {
    var _props2 = this.props;
    var activeIndex = _props2.activeIndex;
    var labelKey = _props2.labelKey;
    var newSelectionPrefix = _props2.newSelectionPrefix;
    var _onClick = _props2.onClick;
    var renderMenuItemChildren = _props2.renderMenuItemChildren;
    var text = _props2.text;


    var menuItemProps = {
      active: idx === activeIndex,
      key: idx,
      onClick: function onClick() {
        return _onClick(option);
      }
    };

    if (option.customOption) {
      return _react2.default.createElement(
        _MenuItem2.default,
        menuItemProps,
        newSelectionPrefix,
        _react2.default.createElement(
          _reactHighlighter2.default,
          { search: text },
          option[labelKey]
        )
      );
    }

    return renderMenuItemChildren ? _react2.default.createElement(
      _MenuItem2.default,
      menuItemProps,
      renderMenuItemChildren(this.props, option, idx)
    ) : _react2.default.createElement(
      _MenuItem2.default,
      menuItemProps,
      _react2.default.createElement(
        _reactHighlighter2.default,
        { search: text },
        option[labelKey]
      )
    );
  },


  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem: function _renderPaginationMenuItem(results) {
    var _props3 = this.props;
    var options = _props3.options;
    var paginationText = _props3.paginationText;


    if (results.length < options.length) {
      return [_react2.default.createElement('li', {
        className: 'divider',
        key: 'pagination-item-divider',
        role: 'separator'
      }), _react2.default.createElement(
        _MenuItem2.default,
        {
          className: 'bootstrap-typeahead-menu-paginator',
          key: 'pagination-item',
          onClick: this._handlePagination },
        paginationText
      )];
    }
  },
  _handlePagination: function _handlePagination(e) {
    var resultCount = this.state.resultCount + this.props.initialResultCount;
    this.setState({ resultCount: resultCount });
  }
});

exports.default = TypeaheadMenu;