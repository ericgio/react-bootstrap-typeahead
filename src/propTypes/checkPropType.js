import PropTypes from 'prop-types';

/**
 * Allows additional warnings or messaging related to prop validation.
 */
export default function checkPropType(validator, callback) {
  return (props, propName, componentName) => {
    PropTypes.checkPropTypes(
      { [propName]: validator },
      props,
      'prop',
      componentName
    );

    typeof callback === 'function' && callback(props, propName, componentName);
  };
}
