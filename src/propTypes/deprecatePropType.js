import warn from '../utils/warn';

export default function deprecatePropType(msg) {
  return function(props, propName, componentName) {
    const value = props[propName];

    warn(
      value === undefined,
      'The `' + propName + '` prop is deprecated and will be removed in a ' +
      'future release. ' + msg
    );
  };
}
