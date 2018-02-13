import getMatchBounds from './getMatchBounds';
import getOptionLabel from './getOptionLabel';

function getHintText({
  activeItem,
  initialItem,
  isMenuShown,
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
    // The menu is hidden.
    !isMenuShown ||
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
  const bounds = getMatchBounds(
    initialItemStr.toLowerCase(),
    text.toLowerCase()
  );

  if (!(bounds && bounds.start === 0)) {
    return '';
  }

  // Text matching is case- and accent-insensitive, so to display the hint
  // correctly, splice the input string with the hint string.
  return text + initialItemStr.slice(
    bounds.end,
    initialItemStr.length
  );
}

export default getHintText;
