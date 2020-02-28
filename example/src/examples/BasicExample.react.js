/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
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
      <FormGroup>
        <Control
          checked={multiple}
          onChange={(e) => setMultiple(e.target.checked)}
          type="checkbox">
          Multi-Select
        </Control>
      </FormGroup>
    </Fragment>
  );
};
/* example-end */

export default BasicExample;
