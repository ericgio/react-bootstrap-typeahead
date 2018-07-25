import {uniqueId} from 'lodash';
import {getOptionLabel, getStringLabelKey} from './index';

function addCustomOption(results, props) {
  const {
    text,
    labelKey,
    allowNew,
  } = props;

  if (!text.trim()) {
    return results;
  }

  // If allowNew isn't a function, omit the new entry if there is an exact match
  if (typeof allowNew === 'boolean') {
    const exactMatchFound = results.some((o) => (
      getOptionLabel(o, labelKey) === text
    ));

    if (exactMatchFound) {
      return results;
    }
  } else {
    // Otherwise let the allowNew function determine
    // whether the new entry should be added
    if (!allowNew(results, {labelKey, text})) {
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
