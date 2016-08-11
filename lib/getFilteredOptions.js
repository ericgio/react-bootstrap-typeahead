'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Filter out options that don't match the input string or, if multiple
 * selections are allowed, that have already been selected.
 */
function getFilteredOptions() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var text = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var selected = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var props = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var allowNew = props.allowNew;
  var labelKey = props.labelKey;
  var minLength = props.minLength;
  var multiple = props.multiple;


  if (text.length < minLength) {
    return [];
  }

  var exactMatchFound = false;
  var filteredOptions = options.filter(function (option) {
    var labelString = option[labelKey];
    if (!labelString || typeof labelString !== 'string') {
      throw new Error('One or more options does not have a valid label string. Please ' + 'check the `labelKey` prop to ensure that it matches the correct ' + 'option key and provides a string for filtering and display.');
    }

    if (labelString === text) {
      exactMatchFound = true;
    }

    return !(labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 || multiple && (0, _find3.default)(selected, function (o) {
      return (0, _isEqual3.default)(o, option);
    }));
  });

  if (allowNew && !!text.trim() && !(filteredOptions.length && exactMatchFound)) {
    var newOption = {
      id: (0, _uniqueId3.default)('new-id-'),
      customOption: true
    };
    newOption[labelKey] = text;
    filteredOptions.push(newOption);
  }

  return filteredOptions;
}

exports.default = getFilteredOptions;