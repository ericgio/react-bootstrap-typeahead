'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _getOptionLabel = require('./getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addCustomOption(results, text, labelKey) {
  results = results.slice();

  var exactMatchFound = (0, _find3.default)(results, function (o) {
    return (0, _getOptionLabel2.default)(o, labelKey) === text;
  });

  if (!text.trim() || exactMatchFound) {
    return results;
  }

  var newOption = {
    id: (0, _uniqueId3.default)('new-id-'),
    customOption: true
  };

  !(typeof labelKey === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '`labelKey` must be a string when creating new options.') : (0, _invariant2.default)(false) : void 0;

  newOption[labelKey] = text;
  results.push(newOption);

  return results;
}

exports.default = addCustomOption;