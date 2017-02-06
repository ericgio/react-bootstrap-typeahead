import React from 'react';
import {Checkbox, FormGroup} from 'react-bootstrap';

import {Typeahead} from '../../src/';

import options from '../../example/exampleData';

/* example-start */
const BasicBehaviorsExample = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      dropup: false,
      minLength: 0,
    };
  },

  render() {
    const {disabled, dropup, emptyLabel, minLength} = this.state;

    return (
      <div>
        <Typeahead
          {...this.state}
          emptyLabel={emptyLabel ? '' : undefined}
          labelKey="name"
          multiple
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          <Checkbox
            checked={disabled}
            name="disabled"
            onChange={this._handleChange}>
            Disable
          </Checkbox>
          <Checkbox
            checked={dropup}
            name="dropup"
            onChange={this._handleChange}>
            Dropup menu
          </Checkbox>
          <Checkbox
            checked={!!minLength}
            name="minLength"
            onChange={this._handleChange}>
            Require minimum input before showing results (2 chars)
          </Checkbox>
          <Checkbox
            checked={emptyLabel}
            name="emptyLabel"
            onChange={this._handleChange}>
            Hide the menu when there are no results
          </Checkbox>
        </FormGroup>
      </div>
    );
  },

  _handleChange(e) {
    const {checked, name} = e.target;
    const newState = {[name]: checked};

    if (name === 'minLength') {
      newState.minLength = checked ? 2 : 0;
    }

    this.setState(newState);
  },
});
/* example-end */

export default BasicBehaviorsExample;
