'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _getDisplayName = require('../utils/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _scrollIntoViewIfNeeded = require('../utils/scrollIntoViewIfNeeded');

var _scrollIntoViewIfNeeded2 = _interopRequireDefault(_scrollIntoViewIfNeeded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var menuItemContainer = function menuItemContainer(Component) {
  return _react2.default.createClass({
    displayName: 'menuItemContainer(' + (0, _getDisplayName2.default)(Component) + ')',

    propTypes: {
      option: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]).isRequired,
      position: _react.PropTypes.number
    },

    contextTypes: {
      activeIndex: _react.PropTypes.number.isRequired,
      onActiveItemChange: _react.PropTypes.func.isRequired,
      onInitialItemChange: _react.PropTypes.func.isRequired,
      onMenuItemClick: _react.PropTypes.func.isRequired
    },

    componentWillMount: function componentWillMount() {
      this._updateInitialItem(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
      var currentlyActive = this.context.activeIndex === this.props.position;
      var option = nextProps.option,
          position = nextProps.position;
      var activeIndex = nextContext.activeIndex,
          onActiveItemChange = nextContext.onActiveItemChange;


      if (position == null) {
        return;
      }

      // The item will become active.
      if (activeIndex === position) {
        // Ensures that if the menu items exceed the bounds of the menu, the
        // menu will scroll up or down as the user hits the arrow keys.
        (0, _scrollIntoViewIfNeeded2.default)((0, _reactDom.findDOMNode)(this));

        // Fire the change handler when the menu item becomes active.
        !currentlyActive && onActiveItemChange(option);
      }

      this._updateInitialItem(nextProps);
    },
    render: function render() {
      var _context = this.context,
          activeIndex = _context.activeIndex,
          onMenuItemClick = _context.onMenuItemClick;

      var _props = this.props,
          option = _props.option,
          position = _props.position,
          props = _objectWithoutProperties(_props, ['option', 'position']);

      return _react2.default.createElement(Component, _extends({}, props, {
        active: activeIndex === position,
        onClick: function onClick() {
          return onMenuItemClick(option);
        }
      }));
    },
    _updateInitialItem: function _updateInitialItem(props) {
      var option = props.option,
          position = props.position;

      if (position === 0) {
        this.context.onInitialItemChange(option);
      }
    }
  });
};

exports.default = menuItemContainer;