/* eslint-disable import/no-extraneous-dependencies */

import React, {Fragment} from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

import {Typeahead} from '../../src';
import options from '../exampleData';

/* example-start */
class PublicMethodsExample extends React.Component {
  render() {
    return (
      <Fragment>
        <Typeahead
          defaultSelected={options.slice(0, 4)}
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
          ref={(ref) => this._typeahead = ref}
        />
        <ButtonToolbar style={{marginTop: '10px'}}>
          <Button
            className="btn-outline-secondary"
            onClick={() => this._typeahead.clear()}>
            Clear
          </Button>
          <Button
            className="btn-outline-secondary"
            onClick={() => this._typeahead.focus()}>
            Focus
          </Button>
          <Button
            className="btn-outline-secondary"
            onClick={() => {
              const instance = this._typeahead;
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
