import React, {Fragment} from 'react';
import {Button, InputGroup} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../exampleData';

/* example-start */
class InputGroupExample extends React.Component {
  render() {
    return (
      <Fragment>
        <InputGroup>
          <InputGroup.Addon className="input-group-prepend">
            <span className="input-group-text">Example</span>
          </InputGroup.Addon>
          <Typeahead
            labelKey="name"
            options={options}
            placeholder="Choose a state..."
          />
          <InputGroup.Button className="input-group-append">
            <Button bsStyle="primary" type="submit">
              Submit
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default InputGroupExample;
