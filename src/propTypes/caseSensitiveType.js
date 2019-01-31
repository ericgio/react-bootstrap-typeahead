import warn from '../utils/warn';

export default function caseSensitiveType(props, propName, componentName) {
  const { caseSensitive, filterBy } = props;
  warn(
    !caseSensitive || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `caseSensitive` prop.'
  );
}
