/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import { sortBy } from 'lodash';
import React, { Fragment } from 'react';
import { Button, FormGroup, InputGroup } from 'react-bootstrap';
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
    let validationState;

    if (selected.length) {
      const isMatch = selected[0].name === state.name;

      // BS4 validation
      isInvalid = !isMatch;
      isValid = isMatch;

      // BS3 validation
      validationState = isMatch ? 'success' : 'error';
    }

    return (
      <Fragment>
        <FormGroup validationState={validationState}>
          <InputGroup>
            <InputGroup.Addon className="input-group-prepend">
              <span className="input-group-text">
                The capital of {state.name} is
              </span>
            </InputGroup.Addon>
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
            <InputGroup.Button className="input-group-append">
              <Button
                className="btn-outline-secondary"
                onClick={() => this.setState(getInitialState())}>
                Play Again
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default FormExample;
