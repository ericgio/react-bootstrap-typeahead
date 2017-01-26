import getOptionLabel from './getOptionLabel';
import stripDiacritics from './stripDiacritics';

function getHintText({
  activeItem,
  initialItem,
  labelKey,
  minLength,
  selected,
  text,
}) {
  // Don't display a hint under the following conditions:
  if (
    // No text entered.
    !text ||
    // Text doesn't meet `minLength` threshold.
    text.length < minLength ||
    // No item in the menu.
    !initialItem ||
    // The initial item is a custom option.
    initialItem.customOption ||
    // One of the menu items is active.
    activeItem ||
    // There's already a selection.
    !!selected.length
  ) {
    return '';
  }

  const initialItemStr = getOptionLabel(initialItem, labelKey);

  if (
    // The input text corresponds to the beginning of the first option.
    // Always strip accents and convert to lower case, since the options are
    // already filtered at this point.
    stripDiacritics(initialItemStr.toLowerCase()).indexOf(
      stripDiacritics(text.toLowerCase())
    ) !== 0
  ) {
    return '';
  }

  // Text matching is case- and accent-insensitive, so to display the hint
  // correctly, splice the input text with the rest of the actual string.
  return text + initialItemStr.slice(
    text.length,
    initialItemStr.length
  );
}

export default getHintText;
