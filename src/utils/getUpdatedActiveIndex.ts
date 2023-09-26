import type { Option } from '../types';
import getOptionProperty from './getOptionProperty';

type Key = 'ArrowDown' | 'ArrowUp';

export function isDisabledOption(index: number, items: Option[]): boolean {
  const option = items[index];
  return !!option && !!getOptionProperty(option, 'disabled');
}

export function skipDisabledOptions(
  currentIndex: number,
  key: Key,
  items: Option[]
): number {
  let newIndex = currentIndex;

  while (isDisabledOption(newIndex, items)) {
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
