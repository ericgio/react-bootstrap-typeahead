import React from 'react';
import {Button, InputGroup, InputGroupButton} from 'reactstrap';

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
          <InputGroupButton>
            <Button color="secondary" type="submit">
              Submit
            </Button>
          </InputGroupButton>
        </InputGroup>
        <span>
          <input checked={submitFormOnEnter}
            onChange={(e) => {
              this.setState({submitFormOnEnter: e.target.checked});
            }}
            type="checkbox"
          />
          <label>Allow form submission</label>
        </span>
      </form>
    );
  }
}
/* example-end */

export default FormSubmitExample;
