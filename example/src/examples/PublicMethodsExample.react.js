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
          className="btn-outline-secondary"
          onClick={() => ref.current.clear()}>
          Clear
        </Button>
        <Button
          className="btn-outline-secondary"
          onClick={() => ref.current.focus()}>
          Focus
        </Button>
        <Button
          className="btn-outline-secondary"
          onClick={() => {
            ref.current.focus();
            setTimeout(() => ref.current.blur(), 1000);
          }}>
          Focus, then blur after 1 second
        </Button>
      </ButtonToolbar>
    </Fragment>
  );
};
/* example-end */

export default PublicMethodsExample;
