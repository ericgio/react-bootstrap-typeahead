// @flow

import { DEFAULT_LABELKEY } from '../constants';

import type { LabelKey } from '../types';

export default function getStringLabelKey(labelKey: LabelKey): string {
  return typeof labelKey === 'string' ? labelKey : DEFAULT_LABELKEY;
}
