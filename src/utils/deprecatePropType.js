import PropTypes from 'prop-types';
import warn from './warn';

export default function deprecatePropType(validator, msg) {
  return function(props, propName, componentName) {
    const value = props[propName];

    warn(
      value === undefined,
      'The `' + propName + '` prop is deprecated and will be removed in a ' +
      'future release. ' + msg
    );

    PropTypes.checkPropTypes(
      {[propName]: validator},
      props,
      'prop',
      componentName
    );
  };
}
