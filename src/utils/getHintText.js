// @flow

import getMatchBounds from './getMatchBounds';
import getOptionLabel from './getOptionLabel';

import type { LabelKey, Option } from '../types';

type Props = {
  activeIndex: number,
  initialItem: ?Option,
  isFocused: boolean,
  isMenuShown: boolean,
  labelKey: LabelKey,
  multiple: boolean,
  selected: Option[],
  text: string,
};

function getHintText(props: Props) {
  const {
    activeIndex,
    initialItem,
    isFocused,
    isMenuShown,
    labelKey,
    multiple,
    selected,
    text,
  } = props;

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
    initialItem.customOption ||
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
  return text + initialItemStr.slice(
    bounds.end,
    initialItemStr.length
  );
}

export default getHintText;
