import { isEqual } from 'lodash';
import getStringLabelKey from './getStringLabelKey';

/**
 * Compare whether items are the same. For custom items, compare the
 * `labelKey` values since a unique id is generated each time, causing the
 * comparison to fail.
 */
export default function areEqual(newItem, existingItem, labelKey) {
  const stringLabelKey = getStringLabelKey(labelKey);

  if (
    newItem && newItem.customOption &&
    existingItem && existingItem.customOption
  ) {
    return newItem[stringLabelKey] === existingItem[stringLabelKey];
  }

  return isEqual(newItem, existingItem);
}
