import React from 'react';

const ExampleSection = props => (
  <div className="example-section">
    <h4>{props.title}</h4>
    {props.children}
  </div>
);

export default ExampleSection;
