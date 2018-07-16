import {uniqueId} from 'lodash';
import {getOptionLabel, getStringLabelKey} from './index';

function addCustomOption(results, text, labelKey, props) {
  const exactMatchFound = props.includeNewOnMatch ? false :
    results.some((o) => (
      getOptionLabel(o, labelKey) === text
    ));

  if (!text.trim() || exactMatchFound) {
    return results;
  }

  const customOption = {
    customOption: true,
    id: uniqueId('new-id-'),
    [getStringLabelKey(labelKey)]: text,
  };

  return [...results, customOption];
}

export default addCustomOption;
