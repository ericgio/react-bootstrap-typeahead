'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _throttle2 = require('lodash/throttle');

var _throttle3 = _interopRequireDefault(_throttle2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactOverlays = require('react-overlays');

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// When appending the overlay to `document.body`, clicking on it will register
// as an "outside" click and immediately close the overlay. This classname tells
// `react-onclickoutside` to ignore the click.
var IGNORE_CLICK_OUTSIDE = 'ignore-react-onclickoutside';

function isBody(container) {
  return container === document.body;
}

/**
 * Custom `Overlay` component, since the version in `react-overlays` doesn't
 * work for our needs. Specifically, the `Position` component doesn't provide
 * the customized placement we need.
 */
var Overlay = _react2.default.createClass({
  displayName: 'Overlay',

  propTypes: {
    container: _react.PropTypes.oneOfType([_componentOrElement2.default, _react.PropTypes.func]).isRequired,
    show: _react.PropTypes.bool,
    target: _react.PropTypes.oneOfType([_componentOrElement2.default, _react.PropTypes.func]).isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      show: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this._updatePosition();
    this._updatePositionThrottled = (0, _throttle3.default)(this._updatePosition, 100);

    window.addEventListener('resize', this._updatePositionThrottled);
    window.addEventListener('scroll', this._updatePositionThrottled, true);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this._updatePositionThrottled();
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this._updatePositionThrottled);
    window.removeEventListener('scroll', this._updatePositionThrottled);
  },
  render: function render() {
    if (!this.props.show) {
      return null;
    }

    var _props = this.props,
        container = _props.container,
        children = _props.children;

    var child = _react.Children.only(children);

    // When not attaching the overlay to `document.body` treat the child as a
    // simple inline element.
    if (!isBody(container)) {
      return child;
    }

    child = (0, _react.cloneElement)(child, _extends({}, child.props, {
      className: (0, _classnames2.default)(child.props.className, IGNORE_CLICK_OUTSIDE),
      style: this.state
    }));

    return _react2.default.createElement(
      _reactOverlays.Portal,
      { container: container },
      child
    );
  },
  _updatePosition: function _updatePosition() {
    // Positioning is only used when body is the container.
    if (!isBody(this.props.container)) {
      return;
    }

    var target = this.props.target;

    var targetElement = typeof target === 'function' ? target() : target;
    var targetNode = (0, _reactDom.findDOMNode)(targetElement);

    if (targetNode) {
      var _window = window,
          innerHeight = _window.innerHeight,
          innerWidth = _window.innerWidth,
          pageYOffset = _window.pageYOffset;

      var _targetNode$getBoundi = targetNode.getBoundingClientRect(),
          bottom = _targetNode$getBoundi.bottom,
          left = _targetNode$getBoundi.left,
          top = _targetNode$getBoundi.top,
          width = _targetNode$getBoundi.width;

      var newState = {
        bottom: innerHeight - pageYOffset - top,
        left: left,
        right: innerWidth - left - width,
        top: pageYOffset + bottom
      };

      // Don't update unless the target element position has changed.
      if (!(0, _isEqual3.default)(this.state, newState)) {
        this.setState(newState);
      }
    }
  }
});

exports.default = Overlay;