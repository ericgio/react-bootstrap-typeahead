import { isEqual, isFunction, isString, some } from 'lodash';

import stripDiacritics from './stripDiacritics';
import warn from './warn';

function isMatch(input, string, props) {
  let searchStr = input;
  let str = string;

  if (!props.caseSensitive) {
    searchStr = searchStr.toLowerCase();
    str = str.toLowerCase();
  }

  if (props.ignoreDiacritics) {
    searchStr = stripDiacritics(searchStr);
    str = stripDiacritics(str);
  }

  return str.indexOf(searchStr) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
export default function defaultFilterBy(option, props) {
  const { filterBy, labelKey, multiple, selected, text } = props;

  // Don't show selected options in the menu for the multi-select case.
  if (multiple && selected.some((o) => isEqual(o, option))) {
    return false;
  }

  const fields = filterBy.slice();

  if (isFunction(labelKey) && isMatch(text, labelKey(option), props)) {
    return true;
  }

  if (isString(labelKey)) {
    // Add the `labelKey` field to the list of fields if it isn't already there.
    if (fields.indexOf(labelKey) === -1) {
      fields.unshift(labelKey);
    }
  }

  if (isString(option)) {
    warn(
      fields.length <= 1,
      'You cannot filter by properties when `option` is a string.'
    );

    return isMatch(text, option, props);
  }

  return some(fields, (field) => {
    let value = option[field];

    if (!isString(value)) {
      warn(
        false,
        'Fields passed to `filterBy` should have string values. Value will ' +
        'be converted to a string; results may be unexpected.'
      );

      // Coerce to string since `toString` isn't null-safe.
      value = `${value}`;
    }

    return isMatch(text, value, props);
  });
}
