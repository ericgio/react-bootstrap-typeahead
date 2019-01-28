/* eslint-disable import/no-extraneous-dependencies */

import React, {Fragment} from 'react';
import {FormGroup} from 'react-bootstrap';

import Control from '../components/Control.react';
import {Typeahead} from '../../src';
import options from '../exampleData';

/* example-start */
class BodyContainerExample extends React.Component {
  state = {
    bodyContainer: true,
    dropup: false,
  };

  render() {
    const {bodyContainer, dropup} = this.state;

    return (
      <Fragment>
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
        <FormGroup>
          <Control
            checked={bodyContainer}
            name="bodyContainer"
            onChange={this._handleChange}
            type="checkbox">
            Attach menu to document body
          </Control>
          <Control
            checked={dropup}
            name="dropup"
            onChange={this._handleChange}
            type="checkbox">
            Dropup menu
          </Control>
        </FormGroup>
      </Fragment>
    );
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
  }
}
/* example-end */

export default BodyContainerExample;
