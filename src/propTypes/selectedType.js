import warn from '../utils/warn';

export default function selectedType(props, propName, componentName) {
  const { onChange, selected } = props;
  warn(
    !selected || (selected && typeof onChange === 'function'),
    'You provided a `selected` prop without an `onChange` handler. If you ' +
    'want the typeahead to be uncontrolled, use `defaultSelected`. ' +
    'Otherwise, set `onChange`.'
  );
}
