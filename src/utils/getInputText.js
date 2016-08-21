import {head} from 'lodash';
import getOptionLabel from './getOptionLabel';

function getInputText(props) {
  const {activeIndex, labelKey, options, selected, text} = props;

  let selectedItem = !!selected.length && head(selected);
  if (selectedItem) {
    return getOptionLabel(selectedItem, labelKey);
  }

  if (activeIndex >= 0) {
    return getOptionLabel(options[activeIndex], labelKey);
  }

  return text;
}

export default getInputText;
