/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
const InputSizeExample = () => {
  const [size, setSize] = useState(undefined);

  const radios = [
    { label: 'Small', value: 'small' },
    { label: 'Default', value: undefined },
    { label: 'Large', value: 'large' },
  ];

  return (
    <Fragment>
      <Typeahead
        id="input-size-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
        size={size}
      />
      <FormGroup>
        {radios.map(({ label, value }) => (
          <Control
            checked={size === value}
            key={value || 'default'}
            onChange={() => setSize(value)}
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

export default InputSizeExample;
