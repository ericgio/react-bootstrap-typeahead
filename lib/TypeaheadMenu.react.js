'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _reactHighlighter = require('react-highlighter');

var _reactHighlighter2 = _interopRequireDefault(_reactHighlighter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Menu = require('./Menu.react');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('./MenuItem.react');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _getOptionLabel = require('./utils/getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MATCH_CLASS = 'bootstrap-typeahead-highlight';

var TypeaheadMenu = _react2.default.createClass({
  displayName: 'TypeaheadMenu',

  /**
   * In addition to the propTypes below, the following props are automatically
   * passed down by `Typeahead`:
   *
   *  - labelKey
   *  - onPaginate
   *  - options
   *  - paginate
   *  - text
   */
  propTypes: {
    /**
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: _react.PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      newSelectionPrefix: 'New selection: '
    };
  },
  render: function render() {
    var menuProps = (0, _pick3.default)(this.props, ['align', 'className', 'dropup', 'emptyLabel', 'maxHeight', 'onPaginate', 'paginate', 'paginationText', 'style']);

    return _react2.default.createElement(
      _Menu2.default,
      menuProps,
      this.props.options.map(this._renderMenuItem)
    );
  },
  _renderMenuItem: function _renderMenuItem(option, idx) {
    var _props = this.props,
        labelKey = _props.labelKey,
        newSelectionPrefix = _props.newSelectionPrefix,
        renderMenuItemChildren = _props.renderMenuItemChildren,
        text = _props.text;


    var menuItemProps = {
      disabled: option.disabled,
      key: idx,
      option: option,
      position: idx
    };

    if (option.customOption) {
      return _react2.default.createElement(
        _MenuItem2.default,
        menuItemProps,
        newSelectionPrefix,
        _react2.default.createElement(
          _reactHighlighter2.default,
          { matchClass: MATCH_CLASS, search: text },
          option[labelKey]
        )
      );
    }

    return renderMenuItemChildren ? _react2.default.createElement(
      _MenuItem2.default,
      menuItemProps,
      renderMenuItemChildren(option, this.props, idx)
    ) : _react2.default.createElement(
      _MenuItem2.default,
      menuItemProps,
      _react2.default.createElement(
        _reactHighlighter2.default,
        { matchClass: MATCH_CLASS, search: text },
        (0, _getOptionLabel2.default)(option, labelKey)
      )
    );
  }
});

exports.default = TypeaheadMenu;