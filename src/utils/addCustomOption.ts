import getOptionLabel from './getOptionLabel';
import { isFunction } from './nodash';

import { Option, TypeaheadPropsAndState } from '../types';

function addCustomOption(
  results: Option[],
  props: TypeaheadPropsAndState
): boolean {
  const { allowNew, labelKey, text } = props;

  if (!allowNew || !text.trim()) {
    return false;
  }

  // If the consumer has provided a callback, use that to determine whether or
  // not to add the custom option.
  if (isFunction(allowNew)) {
    return allowNew(results, props);
  }

  // By default, don't add the custom option if there is an exact text match
  // with an existing option.
  return !results.some((o) => getOptionLabel(o, labelKey) === text);
}

export default addCustomOption;
