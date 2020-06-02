/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useRef } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const PublicMethodsExample = () => {
  const ref = useRef();

  return (
    <Fragment>
      <Typeahead
        defaultSelected={options.slice(0, 4)}
        id="public-methods-example"
        labelKey="name"
        multiple
        options={options}
        placeholder="Choose a state..."
        ref={ref}
      />
      <ButtonToolbar style={{ marginTop: '10px' }}>
        <Button
          onClick={() => ref.current.clear()}
          variant="outline-secondary">
          Clear
        </Button>
        <Button
          onClick={() => ref.current.focus()}
          variant="outline-secondary">
          Focus
        </Button>
        <Button
          onClick={() => {
            ref.current.focus();
            setTimeout(() => ref.current.blur(), 1000);
          }}
          variant="outline-secondary">
          Focus, then blur after 1 second
        </Button>
      </ButtonToolbar>
    </Fragment>
  );
};
/* example-end */

export default PublicMethodsExample;
