import {head} from 'lodash';
import getOptionLabel from './getOptionLabel';

function getInputText({activeItem, labelKey, selected, text}) {
  if (activeItem) {
    return getOptionLabel(activeItem, labelKey);
  }

  const selectedItem = !!selected.length && head(selected);
  if (selectedItem) {
    return getOptionLabel(selectedItem, labelKey);
  }

  return text;
}

export default getInputText;
