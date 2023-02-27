import getMatchBounds from './getMatchBounds';
import getOptionLabel from './getOptionLabel';
import hasOwnProperty from './hasOwnProperty';
import { isString } from './nodash';

import { LabelKey, OptionType } from '../types';

interface HintProps {
  activeIndex: number;
  initialItem?: OptionType;
  isFocused: boolean;
  isMenuShown: boolean;
  labelKey: LabelKey;
  multiple: boolean;
  selected: OptionType[];
  text: string;
}

function getHintText({
  activeIndex,
  initialItem,
  isFocused,
  isMenuShown,
  labelKey,
  multiple,
  selected,
  text,
}: HintProps) {
  // Don't display a hint under the following conditions:
  if (
    // No text entered.
    !text ||
    // The input is not focused.
    !isFocused ||
    // The menu is hidden.
    !isMenuShown ||
    // No item in the menu.
    !initialItem ||
    // The initial item is a custom option.
    (!isString(initialItem) && hasOwnProperty(initialItem, 'customOption')) ||
    // One of the menu items is active.
    activeIndex > -1 ||
    // There's already a selection in single-select mode.
    (!!selected.length && !multiple)
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
  return text + initialItemStr.slice(bounds.end, initialItemStr.length);
}

export default getHintText;
