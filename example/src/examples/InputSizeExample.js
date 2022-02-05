/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const InputSizeExample = () => {
  const [size, setSize] = useState(undefined);

  const radios = [
    { label: 'Small', value: 'sm' },
    { label: 'Default', value: undefined },
    { label: 'Large', value: 'lg' },
  ];

  return (
    <>
      <Typeahead
        id="input-size-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
        size={size}
      />
      <Form.Group>
        {radios.map(({ label, value }) => (
          <Form.Check
            checked={size === value}
            id={`input-size-${label}`}
            key={value || 'default'}
            label={label}
            onChange={() => setSize(value)}
            type="radio"
            value={value}
          />
        ))}
      </Form.Group>
    </>
  );
};
/* example-end */

export default InputSizeExample;
