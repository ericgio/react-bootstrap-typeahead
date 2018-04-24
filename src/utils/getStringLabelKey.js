import {DEFAULT_LABELKEY} from '../constants/defaultLabelKey';

export default function getStringLabelKey(labelKey) {
  return typeof labelKey === 'string' ? labelKey : DEFAULT_LABELKEY;
}
