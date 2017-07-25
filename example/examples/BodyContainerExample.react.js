import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class BodyContainerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyContainer: true,
      dropup: false,
    };
  }

  render() {
    const {bodyContainer, dropup} = this.state;

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
              {...this.state}
              labelKey="name"
              options={options}
              placeholder="Choose a state..."
            />
          </div>
        </div>
        <Checkbox
          checked={bodyContainer}
          name="bodyContainer"
          onChange={this._handleChange}>
          Attach menu to document body
        </Checkbox>
        <Checkbox
          checked={dropup}
          name="dropup"
          onChange={this._handleChange}>
          Dropup menu
        </Checkbox>
      </div>
    );
  }

  _handleChange = e => {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
  }
}
/* example-end */

export default BodyContainerExample;
