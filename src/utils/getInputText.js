import { head } from 'lodash';
import getOptionLabel from './getOptionLabel';

function getInputText({ activeItem, labelKey, multiple, selected, text }) {
  if (activeItem) {
    // Display the input value if the pagination item is active.
    return activeItem.paginationOption ?
      text :
      getOptionLabel(activeItem, labelKey);
  }

  const selectedItem = !multiple && !!selected.length && head(selected);
  if (selectedItem) {
    return getOptionLabel(selectedItem, labelKey);
  }

  return text;
}

export default getInputText;
