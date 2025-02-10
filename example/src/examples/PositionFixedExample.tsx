import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const PositionFixedExample = () => {
  const [positionFixed, setPositionFixed] = useState(true);

  return (
    <>
      <div
        style={{
          border: '1px solid #ddd',
          height: '116px',
          overflowY: 'scroll',
          padding: '40px',
        }}>
        <div style={{ height: '300px' }}>
          <Typeahead
            id="position-fixed-example"
            labelKey="name"
            options={options}
            placeholder="Choose a state..."
            positionFixed={positionFixed}
          />
        </div>
      </div>
      <Form.Group className="mt-3">
        <Form.Check
          checked={positionFixed}
          id="position-fixed"
          label="Use fixed positioning"
          onChange={(e) => setPositionFixed(e.target.checked)}
          type="checkbox"
        />
      </Form.Group>
    </>
  );
};
/* example-end */

export default PositionFixedExample;
