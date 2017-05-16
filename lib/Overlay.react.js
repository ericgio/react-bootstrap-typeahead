'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactOverlays = require('react-overlays');

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay(props) {
    _classCallCheck(this, Overlay);

    var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props));

    _this.displayName = 'Overlay';


    _this._updatePosition = _this._updatePosition.bind(_this);

    _this.state = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };
    return _this;
  }

  _createClass(Overlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._updatePosition();

      this._updatePositionThrottled = requestAnimationFrame.bind(null, this._updatePosition);

      window.addEventListener('resize', this._updatePositionThrottled);
      window.addEventListener('scroll', this._updatePositionThrottled, true);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._updatePositionThrottled();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      window.removeEventListener('resize', this._updatePositionThrottled);
      window.removeEventListener('scroll', this._updatePositionThrottled);
    }
  }, {
    key: 'render',
    value: function render() {
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
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition() {
      // Positioning is only used when body is the container.
      if (!this.props.show || !this._mounted || !isBody(this.props.container)) {
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
  }]);

  return Overlay;
}(_react2.default.Component);

Overlay.propTypes = {
  container: _propTypes2.default.oneOfType([_componentOrElement2.default, _propTypes2.default.func]).isRequired,
  show: _propTypes2.default.bool,
  target: _propTypes2.default.oneOfType([_componentOrElement2.default, _propTypes2.default.func]).isRequired
};

Overlay.defaultProps = {
  show: false
};

exports.default = Overlay;