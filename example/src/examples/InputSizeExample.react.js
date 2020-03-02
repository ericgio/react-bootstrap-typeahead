/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const InputSizeExample = () => {
  const [bsSize, setBsSize] = useState(undefined);

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
      <Form.Group>
        {radios.map(({ label, value }) => (
          <Form.Check
            checked={bsSize === value}
            id={`input-size-${label}`}
            key={value || 'default'}
            label={label}
            onChange={() => setBsSize(value)}
            type="radio"
            value={value}
          />
        ))}
      </Form.Group>
    </Fragment>
  );
};
/* example-end */

export default InputSizeExample;
