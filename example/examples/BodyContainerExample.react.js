import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class BodyContainerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyContainer: false,
    };
  }

  render() {
    const {bodyContainer} = this.state;

    return (
      <div>
        <div
          style={{
            border: '1px solid #ddd',
            height: '116px',
            overflowY: 'scroll',
            padding: '40px',
          }}>
          <div style={{height: '300px'}}>
            <Typeahead
              bodyContainer={bodyContainer}
              labelKey="name"
              options={options}
              placeholder="Choose a state..."
            />
          </div>
        </div>
        <Checkbox
          checked={bodyContainer}
          onChange={e => this.setState({bodyContainer: e.target.checked})}>
          Attach menu to document body
        </Checkbox>
      </div>
    );
  }
}
/* example-end */

export default BodyContainerExample;
