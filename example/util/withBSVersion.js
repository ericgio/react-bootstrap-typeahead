import PropTypes from 'prop-types';
import React from 'react';

export default function withBSVersion(Component) {
  class WrappedComponent extends React.Component {
    render() {
      return <Component {...this.props} {...this.context} />;
    }
  }

  WrappedComponent.contextTypes = {
    isBS3: PropTypes.bool.isRequired,
  };

  return WrappedComponent;
}
