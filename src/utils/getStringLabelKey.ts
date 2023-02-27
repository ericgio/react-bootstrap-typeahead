import { DEFAULT_LABELKEY } from '../constants';
import type { LabelKey } from '../types';
import {OptionType} from "../types";

export default function getStringLabelKey<Option extends OptionType>(labelKey: LabelKey<Option>): string {
  return typeof labelKey === 'string' ? labelKey : DEFAULT_LABELKEY;
}
