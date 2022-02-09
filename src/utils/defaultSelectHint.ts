import { KeyboardEvent } from 'react';

import isSelectable from './isSelectable';

import type { SelectHint } from '../types';

export default function defaultSelectHint(
  e: KeyboardEvent<HTMLInputElement>,
  selectHint?: SelectHint
): boolean {
  let shouldSelectHint = false;

  if (e.key === 'ArrowRight') {
    // For selectable input types ("text", "search"), only select the hint if
    // it's at the end of the input value. For non-selectable types ("email",
    // "number"), always select the hint.
    shouldSelectHint = isSelectable(e.currentTarget)
      ? e.currentTarget.selectionStart === e.currentTarget.value.length
      : true;
  }

  if (e.key === 'Tab') {
    // Prevent input from blurring on TAB.
    e.preventDefault();
    shouldSelectHint = true;
  }

  return selectHint ? selectHint(shouldSelectHint, e) : shouldSelectHint;
}
