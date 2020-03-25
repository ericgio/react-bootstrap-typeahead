// @flow

import isSelectable from './isSelectable';
import { RETURN, RIGHT, TAB } from '../constants';

export default function shouldSelectHint(
  { currentTarget, keyCode }: SyntheticKeyboardEvent<HTMLInputElement>,
  hintText: string,
  selectHintOnEnter: boolean,
): boolean {
  if (!hintText) {
    return false;
  }

  if (keyCode === RIGHT) {
    // For selectable input types ("text", "search"), only select the hint if
    // it's at the end of the input value. For non-selectable types ("email",
    // "number"), always select the hint.
    return isSelectable(currentTarget) ?
      currentTarget.selectionStart === currentTarget.value.length :
      true;
  }

  if (keyCode === TAB) {
    return true;
  }

  if (keyCode === RETURN && selectHintOnEnter) {
    return true;
  }

  return false;
}
