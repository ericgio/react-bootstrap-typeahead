// @flow

import { isEqual, isString } from 'lodash';
import getStringLabelKey from './getStringLabelKey';

import type { LabelKey, Option } from '../types';

/**
 * Compare whether options are the same. For custom options, compare the
 * `labelKey` values since a unique id is generated each time, causing the
 * comparison to fail.
 */
export default function areEqual(
  newItem?: Option,
  existingItem?: Option,
  labelKey: LabelKey
): boolean {
  const stringLabelKey = getStringLabelKey(labelKey);

  if (
    newItem && !isString(newItem) && newItem.customOption &&
    existingItem && !isString(existingItem) && existingItem.customOption
  ) {
    return newItem[stringLabelKey] === existingItem[stringLabelKey];
  }

  return isEqual(newItem, existingItem);
}
