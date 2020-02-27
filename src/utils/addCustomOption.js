// @flow

import getOptionLabel from './getOptionLabel';

import type { Option, TypeaheadManagerProps } from '../types';

function addCustomOption(
  results: Option[],
  props: TypeaheadManagerProps
): boolean {
  const { allowNew, labelKey, text } = props;

  if (!allowNew || !text.trim()) {
    return false;
  }

  // If the consumer has provided a callback, use that to determine whether or
  // not to add the custom option.
  if (typeof allowNew === 'function') {
    return allowNew(results, props);
  }

  // By default, don't add the custom option if there is an exact text match
  // with an existing option.
  return !results.some((o) => getOptionLabel(o, labelKey) === text);
}

export default addCustomOption;
