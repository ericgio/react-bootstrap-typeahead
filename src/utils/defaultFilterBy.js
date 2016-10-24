import {some} from 'lodash';

function isMatch(input, string, caseSensitive) {
  if (!caseSensitive) {
    input = input.toLowerCase();
    string = string.toLowerCase();
  }
  return string.indexOf(input) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
function defaultFilterBy(
  option,
  labelKey,
  isTokenized,
  text,
  filterOptions
) {

  // Don't show selected options in the menu for the multi-select case.
  if (isTokenized) {
    return false;
  }

  const {caseSensitive} = filterOptions;
  const fields = filterOptions.fields.slice();

  // Add the `labelKey` field to the list of fields if it isn't already there.
  if (fields.indexOf(labelKey) === -1) {
    fields.unshift(labelKey);
  }

  if (typeof option === 'string') {
    if (fields.length > 1) {
      console.error(
        '[react-bootstrap-typeahead] Cannot filter by property when `option` ' +
        'is a string.'
      );
    }
    return isMatch(text, option, caseSensitive);
  }

  return some(fields, field => {
    let value = option[field];

    if (typeof value !== 'string') {
      console.error(
        '[react-bootstrap-typeahead] Fields passed to `filterBy` should have ' +
        'string values. Value will be converted.'
      );
      // Coerce to string since `toString` isn't null-safe.
      value = value + '';
    }

    return isMatch(text, value, caseSensitive);
  });
}

export default defaultFilterBy;
