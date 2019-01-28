/* eslint-disable import/no-extraneous-dependencies */

import React, {Fragment} from 'react';
import {FormGroup} from 'react-bootstrap';

import Control from '../components/Control.react';
import {Typeahead} from '../../src';

import options from '../exampleData';

/* example-start */
class BasicBehaviorsExample extends React.Component {
  state = {
    disabled: false,
    dropup: false,
    flip: false,
    highlightOnlyResult: false,
    minLength: 0,
    open: undefined,
    selectHintOnEnter: false,
  };

  render() {
    const {
      disabled,
      dropup,
      emptyLabel,
      flip,
      highlightOnlyResult,
      minLength,
      open,
      selectHintOnEnter,
    } = this.state;

    const checkboxes = [
      /* eslint-disable max-len */
      {checked: disabled, children: 'Disable the input', name: 'disabled'},
      {checked: dropup, children: 'Dropup menu', name: 'dropup'},
      {checked: flip, children: 'Flip the menu position when it reaches the viewport bounds', name: 'flip'},
      {checked: !!minLength, children: 'Require minimum input before showing results (2 chars)', name: 'minLength'},
      {checked: emptyLabel, children: 'Hide the menu when there are no results', name: 'emptyLabel'},
      {checked: selectHintOnEnter, children: 'Select the hinted result by pressing enter', name: 'selectHintOnEnter'},
      {checked: highlightOnlyResult, children: 'Highlight the only result', name: 'highlightOnlyResult'},
      {checked: !!open, children: 'Force the menu to stay open', name: 'open'},
      /* eslint-enable max-len */
    ];

    return (
      <Fragment>
        <Typeahead
          {...this.state}
          emptyLabel={emptyLabel ? '' : undefined}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {checkboxes.map((props) => (
            <Control
              {...props}
              key={props.name}
              onChange={this._handleChange}
              type="checkbox"
            />
          ))}
        </FormGroup>
      </Fragment>
    );
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    const newState = {[name]: checked};

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
  }
}
/* example-end */

export default BasicBehaviorsExample;
