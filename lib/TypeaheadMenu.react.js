'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactHighlighter = require('react-highlighter');

var _reactHighlighter2 = _interopRequireDefault(_reactHighlighter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Menu = require('./Menu.react');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('./MenuItem.react');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _getOptionLabel = require('./utils/getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MATCH_CLASS = 'bootstrap-typeahead-highlight';

var TypeaheadMenu = function (_React$Component) {
  _inherits(TypeaheadMenu, _React$Component);

  function TypeaheadMenu(props) {
    _classCallCheck(this, TypeaheadMenu);

    var _this = _possibleConstructorReturn(this, (TypeaheadMenu.__proto__ || Object.getPrototypeOf(TypeaheadMenu)).call(this, props));

    _this.displayName = 'TypeaheadMenu';


    _this._renderMenuItem = _this._renderMenuItem.bind(_this);
    return _this;
  }

  _createClass(TypeaheadMenu, [{
    key: 'render',
    value: function render() {
      var menuProps = (0, _pick3.default)(this.props, ['align', 'className', 'dropup', 'emptyLabel', 'maxHeight', 'onPaginate', 'paginate', 'paginationText', 'style']);

      return _react2.default.createElement(
        _Menu2.default,
        menuProps,
        this.props.options.map(this._renderMenuItem)
      );
    }
  }, {
    key: '_renderMenuItem',
    value: function _renderMenuItem(option, idx) {
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
  }]);

  return TypeaheadMenu;
}(_react2.default.Component);

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


TypeaheadMenu.propTypes = {
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix: _propTypes2.default.string,
  /**
   * Provides a hook for customized rendering of menu item contents.
   */
  renderMenuItemChildren: _propTypes2.default.func
};

TypeaheadMenu.getDefaultProps = {
  newSelectionPrefix: 'New selection: '
};

exports.default = TypeaheadMenu;