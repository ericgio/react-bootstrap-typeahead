/* eslint-disable import/no-extraneous-dependencies */

import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';

import Control from '../components/Control.react';
import { Typeahead } from '../../src';
import options from '../exampleData';

/* example-start */
class BasicExample extends React.Component {
  state = {
    multiple: false,
  };

  render() {
    const { multiple } = this.state;

    return (
      <Fragment>
        <Typeahead
          labelKey="name"
          multiple={multiple}
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          <Control
            checked={multiple}
            onChange={(e) => this.setState({ multiple: e.target.checked })}
            type="checkbox">
            Multi-Select
          </Control>
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default BasicExample;
