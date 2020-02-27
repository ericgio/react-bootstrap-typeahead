/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
class BasicExample extends React.Component {
  state = {
    multiple: false,
    selected: [],
  };

  render() {
    return (
      <Fragment>
        <Typeahead
          {...this.state}
          id="basic-example"
          labelKey="name"
          onChange={(selected) => this.setState({ selected })}
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          <Control
            checked={this.state.multiple}
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
