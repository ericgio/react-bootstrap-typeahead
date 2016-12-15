import React from 'react';

import CodeSample from '../components/CodeSample.react';

const ExampleSection = React.createClass({
  getInitialState() {
    return {
      open: false,
    };
  },

  render() {
    const {children, code} = this.props;
    const {open} = this.state;

    return (
      <div className="example-section">
        <div className="example">
          <div className="clearfix">
            <h6>Example</h6>
            <a
              className="example-toggle-code"
              onClick={e => {
                e.preventDefault();
                this.setState({open: !open});
              }}
              role="button">
              {`${open ? 'Hide' : 'Show'} Code`}
            </a>
          </div>
          {children}
        </div>
        {open ? <CodeSample>{code}</CodeSample> : null}
      </div>
    );
  },
});

export default ExampleSection;
