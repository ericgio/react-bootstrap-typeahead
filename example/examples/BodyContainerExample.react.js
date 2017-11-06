import React from 'react';
// import {Checkbox} from 'reactstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class BodyContainerExample extends React.Component {
  state = {
    bodyContainer: true,
    dropup: false,
  };

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
        <span>
          <input checked={bodyContainer}
            name="bodyContainer"
            onChange={this._handleChange}
            type="checkbox"
          />
          <label>Attach menu to document body</label>
        </span>
        <span>
          <input checked={dropup}
            name="dropup"
            onChange={this._handleChange}
            type="checkbox"
          />
          <label>Dropup menu</label>
        </span>
      </div>
    );
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
  }
}
/* example-end */

export default BodyContainerExample;
