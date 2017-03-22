'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TextInput = _react2.default.createClass({
  displayName: 'TextInput',

  propTypes: {
    /**
     * Specify the size of the input.
     */
    bsSize: _react.PropTypes.oneOf(['large', 'lg', 'small', 'sm'])
  },

  render: function render() {
    var _this = this;

    var _props = this.props,
        bsSize = _props.bsSize,
        className = _props.className,
        hasAux = _props.hasAux,
        otherProps = _objectWithoutProperties(_props, ['bsSize', 'className', 'hasAux']);

    return _react2.default.createElement('input', _extends({}, otherProps, {
      className: (0, _classnames2.default)('form-control', {
        'has-aux': hasAux,
        'input-lg': bsSize === 'large' || bsSize === 'lg',
        'input-sm': bsSize === 'small' || bsSize === 'sm'
      }, className),
      ref: function ref(input) {
        return _this._input = input;
      },
      type: 'text'
    }));
  },
  getInstance: function getInstance() {
    return this._input;
  }
});

exports.default = TextInput;