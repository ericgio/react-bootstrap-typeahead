import { isString } from './nodash';
import { OptionType } from '../types';

export default function getOptionProperty<Option extends OptionType>(option: Option, key: string) {
  if (isString(option)) {
    return undefined;
  }

  return option[key];
}
