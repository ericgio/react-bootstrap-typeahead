import React from 'react';
import {Button, Checkbox, InputGroup} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

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
          <Typeahead
            labelKey="name"
            options={options}
            placeholder="Choose a state..."
            submitFormOnEnter={submitFormOnEnter}
          />
          <InputGroup.Button>
            <Button className="btn-secondary" type="submit">
              Submit
            </Button>
          </InputGroup.Button>
        </InputGroup>
        <Checkbox
          checked={submitFormOnEnter}
          onChange={(e) => {
            this.setState({submitFormOnEnter: e.target.checked});
          }}>
          Allow form submission
        </Checkbox>
      </form>
    );
  }
}
/* example-end */

export default FormSubmitExample;
