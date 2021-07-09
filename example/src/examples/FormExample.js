/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import { sortBy } from 'lodash';
import React, { Fragment } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const getInitialState = () => ({
  index: Math.floor(Math.random() * options.length),
  selected: [],
});

class FormExample extends React.Component {
  state = getInitialState();

  render() {
    const { index, selected } = this.state;
    const state = options[index];

    let isInvalid;
    let isValid;

    if (selected.length) {
      const isMatch = selected[0].name === state.name;

      // BS4 validation
      isInvalid = !isMatch;
      isValid = isMatch;
    }

    return (
      <Fragment>
        <Form.Group>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>The capital of {state.name} is</InputGroup.Text>
            </InputGroup.Prepend>
            <Typeahead
              id="form-example"
              isInvalid={isInvalid}
              isValid={isValid}
              labelKey="capital"
              onChange={(s) => this.setState({ selected: s })}
              options={sortBy(options, 'capital')}
              placeholder="Select a capital..."
              selected={selected}
            />
            <InputGroup.Append>
              <Button
                onClick={() => this.setState(getInitialState())}
                variant="outline-secondary">
                Play Again
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Fragment>
    );
  }
}
/* example-end */

export default FormExample;
