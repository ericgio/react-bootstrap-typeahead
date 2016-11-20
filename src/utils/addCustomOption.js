import invariant from 'invariant';
import {find, uniqueId} from 'lodash';
import getOptionLabel from './getOptionLabel';

function addCustomOption(results, text, labelKey) {
  results = results.slice();

  const exactMatchFound = find(results, o => (
    getOptionLabel(o, labelKey) === text
  ));

  if (!text.trim() || exactMatchFound) {
    return results;
  }

  const newOption = {
    id: uniqueId('new-id-'),
    customOption: true,
  };

  invariant(
    typeof labelKey === 'string',
    '`labelKey` must be a string when creating new options.'
  );

  newOption[labelKey] = text;
  results.push(newOption);

  return results;
}

export default addCustomOption;
