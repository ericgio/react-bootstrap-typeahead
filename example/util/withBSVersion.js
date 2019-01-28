import PropTypes from 'prop-types';
import React from 'react';

export default function withBSVersion(Component) {
  const WrappedComponent = (props, context) => (
    <Component {...props} {...context} />
  );

  WrappedComponent.contextTypes = {
    isBS3: PropTypes.bool.isRequired,
  };

  return WrappedComponent;
}
