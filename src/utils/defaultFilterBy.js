// @flow

import isEqual from 'fast-deep-equal';

import getOptionProperty from './getOptionProperty';
import { isFunction, isString } from './nodash';
import stripDiacritics from './stripDiacritics';
import warn from './warn';

import type { LabelKey, Option } from '../types';

type Props = {
  caseSensitive: boolean,
  filterBy: string[],
  ignoreDiacritics: boolean,
  labelKey: LabelKey,
  multiple: boolean,
  selected: Option[],
  text: string,
};

function isMatch(input: string, string: string, props: Props): boolean {
  let searchStr = input;
  let str = string;

  if (!props.caseSensitive) {
    searchStr = searchStr.toLowerCase();
    str = str.toLowerCase();
  }

  if (props.ignoreDiacritics) {
    searchStr = stripDiacritics(searchStr);
    str = stripDiacritics(str);
  }

  return str.indexOf(searchStr) !== -1;
}

/**
 * Default algorithm for filtering results.
 */
export default function defaultFilterBy(option: Option, props: Props) {
  const { filterBy, labelKey, multiple, selected, text } = props;

  // Don't show selected options in the menu for the multi-select case.
  if (multiple && selected.some((o) => isEqual(o, option))) {
    return false;
  }

  if (isFunction(labelKey) && isMatch(text, labelKey(option), props)) {
    return true;
  }

  const fields: string[] = filterBy.slice();

  if (isString(labelKey)) {
    // Add the `labelKey` field to the list of fields if it isn't already there.
    if (fields.indexOf(labelKey) === -1) {
      fields.unshift(labelKey);
    }
  }

  if (isString(option)) {
    warn(
      fields.length <= 1,
      'You cannot filter by properties when `option` is a string.'
    );

    return isMatch(text, option, props);
  }

  return fields.some((field: string) => {
    let value = getOptionProperty(option, field);

    if (!isString(value)) {
      warn(
        false,
        'Fields passed to `filterBy` should have string values. Value will ' +
        'be converted to a string; results may be unexpected.'
      );

      value = String(value);
    }

    return isMatch(text, value, props);
  });
}
