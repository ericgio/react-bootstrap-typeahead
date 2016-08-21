import {isPlainObject} from 'lodash';

/**
 * Retrieves the display string from an option. Options can be the string
 * themselves, or an object with a defined display string. Anything else throws
 * an error.
 */
function getOptionLabel(option, labelKey) {
  let optionLabel;

  if (typeof option === 'string') {
    optionLabel = option;
  }

  if (isPlainObject(option)) {
    optionLabel = option[labelKey];
  }

  if (typeof optionLabel !== 'string') {
    throw new Error(
      'One or more options does not have a valid label string. Please ' +
      'check the `labelKey` prop to ensure that it matches the correct ' +
      'option key and provides a string for filtering and display.'
    );
  }

  return optionLabel;
}

export default getOptionLabel;
