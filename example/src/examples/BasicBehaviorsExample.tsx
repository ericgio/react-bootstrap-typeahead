/* eslint-disable import/no-unresolved */

import React, { ChangeEvent, useReducer } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

interface State {
  disabled: boolean;
  dropup: boolean;
  flip: boolean;
  highlightOnlyResult: boolean;
  minLength: number;
  open?: boolean;
}

interface Action {
  checked: boolean;
  name: keyof State;
}

/* example-start */
const initialState = {
  disabled: false,
  dropup: false,
  flip: false,
  highlightOnlyResult: false,
  minLength: 0,
  open: undefined,
};

function reducer(state: State, { checked, name }: Action) {
  switch (name) {
    case 'minLength':
      return {
        ...state,
        [name]: checked ? 2 : 0,
      };
    case 'open':
      return {
        ...state,
        [name]: checked || undefined,
      };
    default:
      return {
        ...state,
        [name]: checked,
      };
      break;
  }
}

function getCheckboxes({
  disabled,
  dropup,
  flip,
  highlightOnlyResult,
  minLength,
  open,
}: State) {
  return [
    { checked: disabled, label: 'Disable the input', name: 'disabled' },
    { checked: dropup, label: 'Dropup menu', name: 'dropup' },
    {
      checked: flip,
      label: 'Flip the menu position when it reaches the viewport bounds',
      name: 'flip',
    },
    {
      checked: !!minLength,
      label: 'Require minimum input before showing results (2 chars)',
      name: 'minLength',
    },
    {
      checked: highlightOnlyResult,
      label: 'Highlight the only result',
      name: 'highlightOnlyResult',
    },
    { checked: open, label: 'Force the menu to stay open', name: 'open' },
  ];
}

function BasicBehaviorsExample() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = e.target;

    dispatch({
      checked,
      name: name as keyof State,
    });
  }

  return (
    <>
      <Typeahead
        {...state}
        id="basic-behaviors-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
      />
      <Form.Group className="mt-3">
        {getCheckboxes(state).map((props) => (
          <Form.Check
            {...props}
            id={props.name}
            key={props.name}
            onChange={onChange}
            type="checkbox"
          />
        ))}
      </Form.Group>
    </>
  );
}
/* example-end */

export default BasicBehaviorsExample;
