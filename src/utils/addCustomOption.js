import invariant from 'invariant';
import {find, uniqueId} from 'lodash';
import getOptionLabel from './getOptionLabel';

function addCustomOption(results, text, labelKey) {
  const exactMatchFound = find(results, o => (
    getOptionLabel(o, labelKey) === text
  ));

  if (!text.trim() || exactMatchFound) {
    return results;
  }

  invariant(
    typeof labelKey === 'string',
    '`labelKey` must be a string when creating new options.'
  );

  const customOption = {
    customOption: true,
    id: uniqueId('new-id-'),
    [labelKey]: text,
  };

  return [...results, customOption];
}

export default addCustomOption;
