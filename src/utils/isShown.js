export default function isShown(results, props) {
  const {emptyLabel, open, minLength, showMenu, text} = props;

  // If menu visibility is controlled via props, that value takes precedence.
  if (open || open === false) {
    return open;
  }

  if (!showMenu) {
    return false;
  }

  if (text.length < minLength) {
    return false;
  }

  return !!(results.length || emptyLabel);
}
