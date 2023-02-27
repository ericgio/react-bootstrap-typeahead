import { isString } from './nodash';
import { OptionType } from '../types';

export default function getOptionProperty(option: OptionType, key: string) {
  if (isString(option)) {
    return undefined;
  }

  return option[key];
}
