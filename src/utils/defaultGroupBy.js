// @flow

import type { GroupedOptions, Option } from '../types';

export default function defaultGroupBy(
  groupKey: typeof Option
): (options: Option[]) => GroupedOptions {
  return function groupBy(options) {
    return options.reduce((grouped: GroupedOptions, option: Option) => {
      const group = option[groupKey];
      const copy = { ...grouped };

      if (!copy[group]) {
        copy[group] = [];
      }

      copy[group].push(option);
      return copy;
    }, {});
  };
}
