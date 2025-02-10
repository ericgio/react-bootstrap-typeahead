import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
type Size = 'sm' | 'lg' | undefined;

interface Radio {
  label: string;
  value: Size;
}

const radios: Radio[] = [
  { label: 'Small', value: 'sm' },
  { label: 'Default', value: undefined },
  { label: 'Large', value: 'lg' },
];

const InputSizeExample = () => {
  const [size, setSize] = useState<Size>();

  return (
    <>
      <Typeahead
        id="input-size-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
        size={size}
      />
      <Form.Group className="mt-3">
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
