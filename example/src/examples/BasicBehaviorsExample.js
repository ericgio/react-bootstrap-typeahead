/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
class BasicBehaviorsExample extends React.Component {
  state = {
    disabled: false,
    dropup: false,
    flip: false,
    highlightOnlyResult: false,
    minLength: 0,
    open: undefined,
  };

  render() {
    const { disabled, dropup, flip, highlightOnlyResult, minLength, open } =
      this.state;

    const checkboxes = [
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
      { checked: !!open, label: 'Force the menu to stay open', name: 'open' },
    ];

    return (
      <>
        <Typeahead
          {...this.state}
          id="basic-behaviors-example"
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <Form.Group>
          {checkboxes.map((props) => (
            <Form.Check
              {...props}
              id={props.name}
              key={props.name}
              onChange={this._handleChange}
              type="checkbox"
            />
          ))}
        </Form.Group>
      </>
    );
  }

  _handleChange = (e) => {
    const { checked, name } = e.target;
    const newState = { [name]: checked };

    switch (name) {
      case 'minLength':
        newState[name] = checked ? 2 : 0;
        break;
      case 'open':
        newState[name] = checked ? true : undefined;
        break;
      default:
        break;
    }

    this.setState(newState);
  };
}
/* example-end */

export default BasicBehaviorsExample;
