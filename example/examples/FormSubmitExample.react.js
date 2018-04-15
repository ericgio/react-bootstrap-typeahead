import React from 'react';
import {Button, FormGroup, InputGroup} from 'react-bootstrap';

import Control from '../components/Control';
import {Typeahead} from '../../src/';
import options from '../exampleData';

/* example-start */
class FormSubmitExample extends React.Component {
  state = {
    submitFormOnEnter: true,
  };

  render() {
    const {submitFormOnEnter} = this.state;

    return (
      <form onSubmit={(e) => alert('Form submitted!')}>
        <InputGroup>
          <InputGroup.Addon className="input-group-prepend">
            <span className="input-group-text">Example</span>
          </InputGroup.Addon>
          <Typeahead
            labelKey="name"
            options={options}
            placeholder="Choose a state..."
            submitFormOnEnter={submitFormOnEnter}
          />
          <InputGroup.Button className="input-group-append">
            <Button bsStyle="primary" type="submit">
              Submit
            </Button>
          </InputGroup.Button>
        </InputGroup>
        <FormGroup>
          <Control
            checked={submitFormOnEnter}
            onChange={(e) => {
              this.setState({submitFormOnEnter: e.target.checked});
            }}
            type="checkbox">
            Allow form submission
          </Control>
        </FormGroup>
      </form>
    );
  }
}
/* example-end */

export default FormSubmitExample;
