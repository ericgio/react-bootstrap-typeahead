/* eslint-disable import/no-extraneous-dependencies */

import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';

import Control from '../components/Control.react';
import { Typeahead } from '../../src';
import options from '../exampleData';

/* example-start */
class MenuAlignExample extends React.Component {
  state = {
    align: 'justify',
  };

  render() {
    const { align } = this.state;
    const radios = [
      { label: 'Justify (default)', value: 'justify' },
      { label: 'Align left', value: 'left' },
      { label: 'Align right', value: 'right' },
    ];

    return (
      <Fragment>
        <Typeahead
          align={align}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {radios.map(({ label, value }) => (
            <Control
              checked={align === value}
              key={value}
              onChange={(e) => this.setState({ align: value })}
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

export default MenuAlignExample;
