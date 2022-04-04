/* eslint-disable import/no-unresolved */

import { sortBy } from 'lodash';
import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options, { Option } from '../data';

/* example-start */
const getIndex = () => Math.floor(Math.random() * options.length);

const FormExample = () => {
  const [index, setIndex] = useState<number>(getIndex());
  const [selected, setSelected] = useState<Option[]>([]);

  const state = options[index];

  let isInvalid;
  let isValid;

  if (selected.length) {
    const isMatch = selected[0].name === state.name;

    isInvalid = !isMatch;
    isValid = isMatch;
  }

  return (
    <>
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
            onChange={setSelected}
            options={sortBy(options, 'capital')}
            placeholder="Select a capital..."
            selected={selected}
          />
          <InputGroup.Append>
            <Button
              onClick={() => {
                setIndex(getIndex());
                setSelected([]);
              }}
              variant="outline-secondary">
              Play Again
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </>
  );
};
/* example-end */

export default FormExample;
