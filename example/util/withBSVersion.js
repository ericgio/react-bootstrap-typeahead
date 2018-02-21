import PropTypes from 'prop-types';
import React from 'react';

export default function withBSVersion(Component) {
  class WrappedComponent extends React.Component {
    render() {
      return <Component {...this.props} {...this.context} />;
    }
  }

  WrappedComponent.contextTypes = {
    isV3: PropTypes.bool.isRequired,
  };

  return WrappedComponent;
}
