import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
const PublicMethodsExample = React.createClass({
  render() {
    return (
      <div>
        <Typeahead
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
          ref={ref => this._typeahead = ref}
          selected={options.slice(0, 4)}
        />
        <ButtonToolbar style={{marginTop: '10px'}}>
          <Button onClick={() => this._typeahead.getInstance().clear()}>
            Clear
          </Button>
          <Button onClick={() => this._typeahead.getInstance().focus()}>
            Focus
          </Button>
          <Button
            onClick={() => {
              const instance = this._typeahead.getInstance();
              instance.focus();
              setTimeout(() => instance.blur(), 1000);
            }}>
            Focus, then blur after 1 second
          </Button>
        </ButtonToolbar>
      </div>
    );
  },
});
/* example-end */

export default PublicMethodsExample;
