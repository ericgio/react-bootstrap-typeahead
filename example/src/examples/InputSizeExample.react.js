/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
class InputSizeExample extends React.Component {
  state = {
    bsSize: undefined,
  };

  render() {
    const { bsSize } = this.state;
    const radios = [
      { label: 'Small', value: 'small' },
      { label: 'Default', value: undefined },
      { label: 'Large', value: 'large' },
    ];

    return (
      <Fragment>
        <Typeahead
          bsSize={bsSize}
          id="input-size-example"
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {radios.map(({ label, value }) => (
            <Control
              checked={bsSize === value}
              key={value || 'default'}
              onChange={(e) => this.setState({ bsSize: value })}
              type="radio"
              value={value}>
              {label}
            </Control>
          ))}
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default InputSizeExample;
