import isSelectable from './isSelectable';
import {RETURN, RIGHT, TAB} from '../constants';

export default function shouldSelectHint(e, props) {
  const {hintText, selectHintOnEnter, value} = props;

  if (!hintText) {
    return false;
  }

  if (e.keyCode === RIGHT) {
    // For selectable input types ("text", "search"), only select the hint if
    // it's at the end of the input value. For non-selectable types ("email",
    // "number"), always select the hint.
    return isSelectable(e.target) ?
      e.target.selectionStart === value.length :
      true;
  }

  if (e.keyCode === TAB) {
    return true;
  }

  if (e.keyCode === RETURN && selectHintOnEnter) {
    return true;
  }

  return false;
}
