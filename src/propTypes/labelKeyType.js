import warn from '../utils/warn';

export default function labelKeyType(props, propName, componentName) {
  const { allowNew, labelKey } = props;
  warn(
    !(typeof labelKey === 'function' && allowNew),
    '`labelKey` must be a string when `allowNew={true}`.'
  );
}
