import getOptionLabel from './getOptionLabel';
import { LabelKey, Option } from '../types';

interface Props {
  activeItem?: Option;
  labelKey: LabelKey;
  multiple: boolean;
  selected: Option[];
  text: string;
}

function getInputText(props: Props): string {
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
