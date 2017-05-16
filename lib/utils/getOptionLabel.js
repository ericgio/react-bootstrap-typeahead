'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieves the display string from an option. Options can be the string
 * themselves, or an object with a defined display string. Anything else throws
 * an error.
 */
function getOptionLabel(option, labelKey) {
  var optionLabel = void 0;

  if (typeof option === 'string') {
    optionLabel = option;
  }

  if ((0, _isPlainObject3.default)(option)) {
    if (typeof labelKey === 'string') {
      optionLabel = option[labelKey];
    } else if ((0, _isFunction3.default)(labelKey)) {
      optionLabel = labelKey(option);
    }
  }

  !(typeof optionLabel === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'One or more options does not have a valid label string. Check the ' + '`labelKey` prop to ensure that it matches the correct option key and ' + 'provides a string for filtering and display.') : (0, _invariant2.default)(false) : void 0;

  return optionLabel;
}

exports.default = getOptionLabel;