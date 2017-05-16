'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

exports.default = defaultFilterBy;

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMatch(input, string, _ref) {
  var caseSensitive = _ref.caseSensitive,
      ignoreDiacritics = _ref.ignoreDiacritics;

  if (!caseSensitive) {
    input = input.toLowerCase();
    string = string.toLowerCase();
  }

  if (ignoreDiacritics) {
    input = (0, _stripDiacritics2.default)(input);
    string = (0, _stripDiacritics2.default)(string);
  }

  return string.indexOf(input) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
function defaultFilterBy(option, text, labelKey, isTokenized, filterOptions) {
  // Don't show selected options in the menu for the multi-select case.
  if (isTokenized) {
    return false;
  }

  var fields = filterOptions.fields.slice();

  if ((0, _isFunction3.default)(labelKey) && isMatch(text, labelKey(option), filterOptions)) {
    return true;
  }

  if (typeof labelKey === 'string') {
    // Add the `labelKey` field to the list of fields if it isn't already there.
    if (fields.indexOf(labelKey) === -1) {
      fields.unshift(labelKey);
    }
  }

  if (typeof option === 'string') {
    (0, _warn2.default)(fields.length <= 1, 'You cannot filter by properties when `option` is a string.');

    return isMatch(text, option, filterOptions);
  }

  return (0, _some3.default)(fields, function (field) {
    var value = option[field];

    if (typeof value !== 'string') {
      (0, _warn2.default)(false, 'Fields passed to `filterBy` should have string values. Value will ' + 'be converted to a string; results may be unexpected.');

      // Coerce to string since `toString` isn't null-safe.
      value = value + '';
    }

    return isMatch(text, value, filterOptions);
  });
}