import React, {Fragment} from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../exampleData';

/* example-start */
class PublicMethodsExample extends React.Component {
  render() {
    return (
      <Fragment>
        <Typeahead
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
          ref={(ref) => this._typeahead = ref}
          selected={options.slice(0, 4)}
        />
        <ButtonToolbar style={{marginTop: '10px'}}>
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
