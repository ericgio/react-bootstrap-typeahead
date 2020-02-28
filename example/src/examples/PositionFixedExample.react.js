/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
const PositionFixedExample = () => {
  const [positionFixed, setPositionFixed] = useState(true);

  return (
    <Fragment>
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
      <FormGroup>
        <Control
          checked={positionFixed}
          onChange={(e) => setPositionFixed(e.target.checked)}
          type="checkbox">
          Use fixed positioning
        </Control>
      </FormGroup>
    </Fragment>
  );
};
/* example-end */

export default PositionFixedExample;
