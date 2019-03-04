import warn from '../utils/warn';

export default function emptyLabelType(props, propName, componentName) {
  const {emptyLabel} = props;
  warn(
    !!emptyLabel,
    'Passing a falsy `emptyLabel` value to hide the menu when the result set ' +
    'is empty is deprecated. Use `renderMenu` to return `null` instead.'
  );
}
