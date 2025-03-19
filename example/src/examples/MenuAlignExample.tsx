import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

type Align = 'justify' | 'left' | 'right' | undefined;

/* example-start */
const MenuAlignExample = () => {
  const [align, setAlign] = useState<Align>('justify');

  const radios = [
    { label: 'Justify (default)', value: 'justify' },
    { label: 'Align left', value: 'left' },
    { label: 'Align right', value: 'right' },
  ] as const;

  return (
    <>
      <Typeahead
        align={align}
        id="menu-align-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
      />
      <Form.Group className="mt-3">
        {radios.map(({ label, value }) => (
          <Form.Check
            checked={align === value}
            id={`align-${value}`}
            key={value}
            label={label}
            onChange={() => setAlign(value)}
            type="radio"
            value={value}
          />
        ))}
      </Form.Group>
    </>
  );
};
/* example-end */

export default MenuAlignExample;
