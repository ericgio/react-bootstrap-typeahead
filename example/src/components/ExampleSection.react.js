/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Button } from 'react-bootstrap';

import CodeSample from './CodeSample.react';

class ExampleSection extends React.Component {
  state = {
    open: false,
  };

  render() {
    const { children, code } = this.props;
    const { open } = this.state;

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
              onClick={(e) => this.setState({ open: !open })}>
              {`${open ? 'Hide' : 'Show'} Code`}
            </Button>
          </div>
          {children}
        </div>
        {open ? <CodeSample>{code}</CodeSample> : null}
      </div>
    );
  }
}

export default ExampleSection;
