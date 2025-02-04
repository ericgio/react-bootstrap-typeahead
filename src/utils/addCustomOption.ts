import getOptionLabel from './getOptionLabel';
import { isFunction } from './nodash';

import { AllowNew, LabelKey, Option, TypeaheadState } from '../types';

interface AddCustomOption extends TypeaheadState {
  allowNew?: AllowNew;
  labelKey: LabelKey;
}

function addCustomOption(
  results: Option[],
  { allowNew, labelKey, ...state }: AddCustomOption
): boolean {
  if (!allowNew || !state.text.trim()) {
    return false;
  }

  // If the consumer has provided a callback, use that to determine whether or
  // not to add the custom option.
  if (isFunction(allowNew)) {
    return allowNew(results, state);
  }

  // By default, don't add the custom option if there is an exact text match
  // with an existing option.
  return !results.some((o) => getOptionLabel(o, labelKey) === state.text);
}

export default addCustomOption;
