// @flow

import getOptionLabel from './getOptionLabel';
import { head } from './nodash';

import type { LabelKey, Option } from '../types';

type Props = {
  activeItem: Option,
  labelKey: LabelKey,
  multiple: boolean,
  selected: Option[],
  text: string,
};

function getInputText(props: Props) {
  const { activeItem, labelKey, multiple, selected, text } = props;

  if (activeItem) {
    // Display the input value if the pagination item is active.
    return getOptionLabel(activeItem, labelKey);
  }

  const selectedItem = !multiple && !!selected.length && head(selected);
  if (selectedItem) {
    return getOptionLabel(selectedItem, labelKey);
  }

  return text;
}

export default getInputText;
