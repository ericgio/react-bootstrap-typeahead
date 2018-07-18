import {uniqueId} from 'lodash';
import {getOptionLabel, getStringLabelKey} from './index';

function addCustomOption(results, text, labelKey, props) {
  if (!text.trim()) {
    return results;
  }

  // If allowNew isn't a function, omit the new entry if there is an exact match
  if (typeof props.allowNew === 'boolean') {
    const exactMatchFound = results.some((o) => (
      getOptionLabel(o, labelKey) === text
    ));

    if (exactMatchFound) {
      return results;
    }
  } else {
    // Otherwise let the allowNew function determine
    // whether the new entry should be added
    if (!props.allowNew(results, text, labelKey)) {
      return results;
    }
  }

  const customOption = {
    customOption: true,
    id: uniqueId('new-id-'),
    [getStringLabelKey(labelKey)]: text,
  };

  return [...results, customOption];
}

export default addCustomOption;
