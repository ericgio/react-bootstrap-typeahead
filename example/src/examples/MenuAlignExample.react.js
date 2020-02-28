/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
const MenuAlignExample = () => {
  const [align, setAlign] = useState('justify');

  const radios = [
    { label: 'Justify (default)', value: 'justify' },
    { label: 'Align left', value: 'left' },
    { label: 'Align right', value: 'right' },
  ];

  return (
    <Fragment>
      <Typeahead
        align={align}
        id="menu-align-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
      />
      <FormGroup>
        {radios.map(({ label, value }) => (
          <Control
            checked={align === value}
            key={value}
            onChange={() => setAlign(value)}
            type="radio"
            value={value}>
            {label}
          </Control>
        ))}
      </FormGroup>
    </Fragment>
  );
};
/* example-end */

export default MenuAlignExample;
