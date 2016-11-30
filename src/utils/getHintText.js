import getOptionLabel from './getOptionLabel';

function getHintText({activeItem, initialItem, labelKey, selected, text}) {
  if (!initialItem || initialItem.customOption) {
    return '';
  }

  const initialItemStr = getOptionLabel(initialItem, labelKey);

  // Only show the hint if:
  if (
    // The input contains text.
    !!text &&
    // None of the menu options are focused.
    !activeItem &&
    // There are no current selections.
    !selected.length &&
    // The input text corresponds to the beginning of the first option.
    initialItemStr.toLowerCase().indexOf(text.toLowerCase()) === 0
  ) {
    // Text matching is case-insensitive, so to display the hint correctly,
    // splice the input text with the rest of the actual string.
    return text + initialItemStr.slice(
      text.length,
      initialItemStr.length
    );
  }

  return '';
}

export default getHintText;
