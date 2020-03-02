/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const BasicExample = () => {
  const [multiple, setMultiple] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <Fragment>
      <Typeahead
        id="basic-typeahead-example"
        labelKey="name"
        multiple={multiple}
        onChange={setSelected}
        options={options}
        placeholder="Choose a state..."
        selected={selected}
      />
      <Form.Group>
        <Form.Check
          checked={multiple}
          id="multi-select-check"
          label="Multi-Select"
          onChange={(e) => setMultiple(e.target.checked)}
          type="checkbox"
        />
      </Form.Group>
    </Fragment>
  );
};
/* example-end */

export default BasicExample;
