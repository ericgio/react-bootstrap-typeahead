/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
class PublicMethodsExample extends React.Component {
  render() {
    return (
      <Fragment>
        <Typeahead
          defaultSelected={options.slice(0, 4)}
          id="public-methods-example"
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
          ref={(ref) => this._typeahead = ref}
        />
        <ButtonToolbar style={{ marginTop: '10px' }}>
          <Button
            className="btn-outline-secondary"
            onClick={() => this._typeahead.getInstance().clear()}>
            Clear
          </Button>
          <Button
            className="btn-outline-secondary"
            onClick={() => this._typeahead.getInstance().focus()}>
            Focus
          </Button>
          <Button
            className="btn-outline-secondary"
            onClick={() => {
              const instance = this._typeahead.getInstance();
              instance.focus();
              setTimeout(() => instance.blur(), 1000);
            }}>
            Focus, then blur after 1 second
          </Button>
        </ButtonToolbar>
      </Fragment>
    );
  }
}
/* example-end */

export default PublicMethodsExample;
