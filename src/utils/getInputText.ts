import getOptionLabel from './getOptionLabel';
import { LabelKey, OptionType } from '../types';

interface Props<Option extends OptionType> {
  activeItem?: Option;
  labelKey: LabelKey<Option>;
  multiple: boolean;
  selected: Option[];
  text: string;
}

function getInputText<Option extends OptionType>(props: Props<Option>): string {
  const { activeItem, labelKey, multiple, selected, text } = props;

  if (activeItem) {
    // Display the input value if the pagination item is active.
    return getOptionLabel(activeItem, labelKey);
  }

  if (!multiple && selected.length && selected[0]) {
    return getOptionLabel(selected[0], labelKey);
  }

  return text;
}

export default getInputText;
