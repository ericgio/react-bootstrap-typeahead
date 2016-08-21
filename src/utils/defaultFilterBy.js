import {find, isEqual} from 'lodash';
import getOptionLabel from './getOptionLabel';

/**
 * Default algorithm for filtering results.
 */
function defaultFilterBy(
  option,
  labelKey,
  multiple,
  selected,
  text
) {
  const labelString = getOptionLabel(option, labelKey);
  return !(
    labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 ||
    multiple && find(selected, o => isEqual(o, option))
  );
}

export default defaultFilterBy;
