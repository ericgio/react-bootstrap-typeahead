import invariant from 'invariant';
import {isPlainObject} from 'lodash';

import getStringLabelKey from './getStringLabelKey';

/**
 * Retrieves the display string from an option. Options can be the string
 * themselves, or an object with a defined display string. Anything else throws
 * an error.
 */
function getOptionLabel(option, labelKey) {
  if (option.paginationOption || option.customOption) {
    return option[getStringLabelKey(labelKey)];
  }

  let optionLabel;

  if (typeof option === 'string') {
    optionLabel = option;
  }

  if (typeof labelKey === 'function') {
    // This overwrites string options, but we assume the consumer wants to do
    // something custom if `labelKey` is a function.
    optionLabel = labelKey(option);
  } else if (typeof labelKey === 'string' && isPlainObject(option)) {
    optionLabel = option[labelKey];
  }

  invariant(
    typeof optionLabel === 'string',
    'One or more options does not have a valid label string. Check the ' +
    '`labelKey` prop to ensure that it matches the correct option key and ' +
    'provides a string for filtering and display.'
  );

  return optionLabel;
}

export default getOptionLabel;
