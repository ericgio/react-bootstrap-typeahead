// @flow

import type { GroupBy } from '../types';
import defaultGroupBy from './defaultGroupBy';

export default function getGroupByFunction(
  groupKey: GroupBy
): (options: Option[]) => GroupedOptions | undefined {
  if (groupKey === undefined || typeof groupKey === 'function') {
    return groupKey;
  }

  return defaultGroupBy(groupKey);
}
