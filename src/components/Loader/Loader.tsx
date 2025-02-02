import React from 'react';

export interface LoaderProps {
  label?: string;
}

const Loader = ({ label = 'Loading...' }: LoaderProps) => (
  <div className="rbt-loader spinner-border spinner-border-sm" role="status">
    <span className="sr-only visually-hidden">{label}</span>
  </div>
);

export default Loader;
