import {head} from 'lodash';

function getInputText(props) {
  const {activeIndex, labelKey, options, selected, text} = props;

  let selectedItem = !!selected.length && head(selected);
  if (selectedItem) {
    return selectedItem[labelKey];
  }

  if (activeIndex >= 0) {
    return options[activeIndex][labelKey];
  }

  return text;
}

export default getInputText;
