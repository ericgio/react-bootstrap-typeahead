// @flow

import type { Option } from '../types';

type Key = 'ArrowDown' | 'ArrowUp';

function skipDisabledOptions(
  currentIndex: number,
  key: Key,
  items: Option[]
): number {
  let newIndex = currentIndex;

  while (items[newIndex] && items[newIndex].disabled) {
    newIndex += key === 'ArrowUp' ? -1 : 1;
  }

  return newIndex;
}

export default function getUpdatedActiveIndex(
  currentIndex: number,
  key: Key,
  items: Option[]
): number {
  let newIndex = currentIndex;

  // Increment or decrement index based on user keystroke.
  newIndex += key === 'ArrowUp' ? -1 : 1;

  // Skip over any disabled options.
  newIndex = skipDisabledOptions(newIndex, key, items);

  // If we've reached the end, go back to the beginning or vice-versa.
  if (newIndex === items.length) {
    newIndex = -1;
  } else if (newIndex === -2) {
    newIndex = items.length - 1;

    // Skip over any disabled options.
    newIndex = skipDisabledOptions(newIndex, key, items);
  }

  return newIndex;
}
