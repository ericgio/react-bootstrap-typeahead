'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loader = function Loader(_ref) {
  var bsSize = _ref.bsSize;
  return _react2.default.createElement('div', {
    className: (0, _classnames2.default)('bootstrap-typeahead-loader', {
      'loader-lg': bsSize === 'large' || bsSize === 'lg',
      'loader-sm': bsSize === 'small' || bsSize === 'sm'
    })
  });
};

Loader.propTypes = {
  bsSize: _react2.default.PropTypes.oneOf(['large', 'lg', 'small', 'sm'])
};

exports.default = Loader;