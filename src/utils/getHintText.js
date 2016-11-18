import {head} from 'lodash';
import getOptionLabel from './getOptionLabel';

function getHintText(props, isFocused) {
  const {activeItem, labelKey, options, selected, text} = props;
  const firstOption = head(options);
  const firstOptionString =
    firstOption && getOptionLabel(firstOption, labelKey);

  // Only show the hint if:
  if (
    // The input is focused.
    isFocused &&
    // The input contains text.
    !!text &&
    // None of the menu options are focused.
    !activeItem &&
    // There are no current selections.
    !selected.length &&
    // The input text corresponds to the beginning of the first option.
    firstOptionString &&
    firstOptionString.toLowerCase().indexOf(text.toLowerCase()) === 0
  ) {
    // Text matching is case-insensitive, so to display the hint correctly,
    // splice the input text with the rest of the actual string.
    return text + firstOptionString.slice(
      text.length,
      firstOptionString.length
    );
  }

  return '';
}

export default getHintText;
