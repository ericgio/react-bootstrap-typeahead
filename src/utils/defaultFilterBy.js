import {isFunction, some} from 'lodash';

import stripDiacritics from './stripDiacritics';
import warn from './warn';

function isMatch(input, string, {caseSensitive, ignoreDiacritics}) {
  if (!caseSensitive) {
    input = input.toLowerCase();
    string = string.toLowerCase();
  }

  if (ignoreDiacritics) {
    input = stripDiacritics(input);
    string = stripDiacritics(string);
  }

  return string.indexOf(input) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
export default function defaultFilterBy(
  option,
  text,
  labelKey,
  isTokenized,
  filterOptions
) {
  // Don't show selected options in the menu for the multi-select case.
  if (isTokenized) {
    return false;
  }

  const fields = filterOptions.fields.slice();

  if (isFunction(labelKey) && isMatch(text, labelKey(option), filterOptions)) {
    return true;
  }

  if (typeof labelKey === 'string') {
    // Add the `labelKey` field to the list of fields if it isn't already there.
    if (fields.indexOf(labelKey) === -1) {
      fields.unshift(labelKey);
    }
  }

  if (typeof option === 'string') {
    warn(
      fields.length <= 1,
      'You cannot filter by properties when `option` is a string.'
    );

    return isMatch(text, option, filterOptions);
  }

  return some(fields, (field) => {
    let value = option[field];

    if (typeof value !== 'string') {
      warn(
        false,
        'Fields passed to `filterBy` should have string values. Value will ' +
        'be converted to a string; results may be unexpected.'
      );

      // Coerce to string since `toString` isn't null-safe.
      value = value + '';
    }

    return isMatch(text, value, filterOptions);
  });
}
