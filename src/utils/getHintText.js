import {head} from 'lodash';
import getOptionLabel from './getOptionLabel';

function getHintText({activeItem, labelKey, results, selected, text}) {
  const firstResult = head(results);
  const firstResultString =
    firstResult && getOptionLabel(firstResult, labelKey);

  // Only show the hint if:
  if (
    // The input contains text.
    !!text &&
    // None of the menu options are focused.
    !activeItem &&
    // There are no current selections.
    !selected.length &&
    // The input text corresponds to the beginning of the first option.
    firstResultString &&
    firstResultString.toLowerCase().indexOf(text.toLowerCase()) === 0
  ) {
    // Text matching is case-insensitive, so to display the hint correctly,
    // splice the input text with the rest of the actual string.
    return text + firstResultString.slice(
      text.length,
      firstResultString.length
    );
  }

  return '';
}

export default getHintText;
