'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOptionLabel = require('./getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHintText(_ref) {
  var activeItem = _ref.activeItem,
      initialItem = _ref.initialItem,
      labelKey = _ref.labelKey,
      minLength = _ref.minLength,
      selected = _ref.selected,
      text = _ref.text;

  // Don't display a hint under the following conditions:
  if (
  // No text entered.
  !text ||
  // Text doesn't meet `minLength` threshold.
  text.length < minLength ||
  // No item in the menu.
  !initialItem ||
  // The initial item is a custom option.
  initialItem.customOption ||
  // One of the menu items is active.
  activeItem ||
  // There's already a selection.
  !!selected.length) {
    return '';
  }

  var initialItemStr = (0, _getOptionLabel2.default)(initialItem, labelKey);

  if (
  // The input text corresponds to the beginning of the first option.
  // Always strip accents and convert to lower case, since the options are
  // already filtered at this point.
  (0, _stripDiacritics2.default)(initialItemStr.toLowerCase()).indexOf((0, _stripDiacritics2.default)(text.toLowerCase())) !== 0) {
    return '';
  }

  // Text matching is case- and accent-insensitive, so to display the hint
  // correctly, splice the input text with the rest of the actual string.
  return text + initialItemStr.slice(text.length, initialItemStr.length);
}

exports.default = getHintText;