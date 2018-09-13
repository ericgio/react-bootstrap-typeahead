export default function isShown(results, props) {
  const {emptyLabel, minLength, showMenu, text} = props;

  if (!showMenu) {
    return false;
  }

  if (text.length < minLength) {
    return false;
  }

  return !!(results.length || emptyLabel);
}
