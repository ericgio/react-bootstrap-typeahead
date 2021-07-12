import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  label: PropTypes.string,
};

const defaultProps = {
  label: 'Loading...',
};

interface LoaderProps {
  label: string;
}

const Loader = ({ label }: LoaderProps) => (
  <div className="rbt-loader spinner-border spinner-border-sm" role="status">
    <span className="sr-only visually-hidden">{label}</span>
  </div>
);

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;
