// @flow

import invariant from 'invariant';

import getStringLabelKey from './getStringLabelKey';
import { isFunction, isString } from './nodash';

import type { LabelKey, Option } from '../types';

/**
 * Retrieves the display string from an option. Options can be the string
 * themselves, or an object with a defined display string. Anything else throws
 * an error.
 */
function getOptionLabel(option: Option, labelKey: LabelKey): string {
  // Handle internally created options first.
  if (
    !isString(option) &&
    (option.paginationOption || option.customOption)
  ) {
    return option[getStringLabelKey(labelKey)];
  }

  let optionLabel;

  if (isFunction(labelKey)) {
    optionLabel = labelKey(option);
  } else if (isString(option)) {
    optionLabel = option;
  } else {
    // `option` is an object and `labelKey` is a string.
    optionLabel = option[labelKey];
  }

  invariant(
    isString(optionLabel),
    'One or more options does not have a valid label string. Check the ' +
    '`labelKey` prop to ensure that it matches the correct option key and ' +
    'provides a string for filtering and display.'
  );

  return optionLabel;
}

export default getOptionLabel;
