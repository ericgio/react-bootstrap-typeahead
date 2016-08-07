import {find, isEqual, uniqueId} from 'lodash';

/**
 * Filter out options that don't match the input string or, if multiple
 * selections are allowed, that have already been selected.
 */
function getFilteredOptions(options=[], text='', selected=[], props={}) {
  const {allowNew, labelKey, minLength, multiple} = props;

  if (text.length < minLength) {
    return [];
  }

  let exactMatchFound = false;
  let filteredOptions = options.filter(option => {
    const labelString = option[labelKey];
    if (!labelString || typeof labelString !== 'string') {
      throw new Error(
        'One or more options does not have a valid label string. Please ' +
        'check the `labelKey` prop to ensure that it matches the correct ' +
        'option key and provides a string for filtering and display.'
      );
    }

    if (labelString === text) {
      exactMatchFound = true;
    }

    return !(
      labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 ||
      multiple && find(selected, o => isEqual(o, option))
    );
  });

  if (
    allowNew &&
    !!text.trim() &&
    !(filteredOptions.length && exactMatchFound)
  ) {
    let newOption = {
      id: uniqueId('new-id-'),
      customOption: true,
    };
    newOption[labelKey] = text;
    filteredOptions.push(newOption);
  }

  return filteredOptions;
}

export default getFilteredOptions;
