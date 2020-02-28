/* eslint-disable import/no-extraneous-dependencies */

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import CodeSample from './CodeSample.react';

const ExampleSection = ({ children, code }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="example-section">
      <div className="example">
        <div className="clearfix">
          <div className="example-section-title">
            Example
          </div>
          <Button
            bsSize="xsmall"
            bsStyle="link"
            className="example-toggle-code"
            onClick={() => setIsOpen(!isOpen)}>
            {`${isOpen ? 'Hide' : 'Show'} Code`}
          </Button>
        </div>
        {children}
      </div>
      {isOpen ? <CodeSample>{code}</CodeSample> : null}
    </div>
  );
};

export default ExampleSection;
