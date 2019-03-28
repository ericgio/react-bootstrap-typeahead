// @flow

import { isString } from './nodash';
import type { Option } from '../types';

export default function getOptionProperty(option: Option, key: string) {
  if (isString(option)) {
    return undefined;
  }

  return option[key];
}
