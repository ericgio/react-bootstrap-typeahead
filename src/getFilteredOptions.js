import {find, isEqual, uniqueId} from 'lodash';
import getOptionLabel from './getOptionLabel';

/**
 * Filter out options that don't match the input string or, if multiple
 * selections are allowed, that have already been selected.
 */
function getFilteredOptions(options=[], text='', selected=[], props={}) {
  const {allowNew, labelKey, minLength, multiple} = props;

  if (text.length < minLength) {
    return [];
  }

  let filteredOptions = options.filter(option => {
    const labelString = getOptionLabel(option, labelKey);
    return !(
      labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 ||
      multiple && find(selected, o => isEqual(o, option))
    );
  });

  const exactMatchFound = find(filteredOptions, o => (
    getOptionLabel(o, labelKey) === text
  ));

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
