import React from 'react';
import {Checkbox, FormGroup} from 'reactstrap';

import {Typeahead} from '../../src/';

import options from '../../example/exampleData';

/* example-start */
class BasicBehaviorsExample extends React.Component {
  state = {
    disabled: false,
    dropup: false,
    highlightOnlyResult: false,
    minLength: 0,
    selectHintOnEnter: false,
  };

  render() {
    const {
      disabled,
      dropup,
      emptyLabel,
      highlightOnlyResult,
      minLength,
      selectHintOnEnter,
    } = this.state;

    return (
      <div>
        <Typeahead
          {...this.state}
          emptyLabel={emptyLabel ? '' : undefined}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          <input checked={disabled}
            name="disabled"
            onChange={this._handleChange}
            type="checkbox"
          />
            Disable

          <input checked={dropup}
            name="dropup"
            onChange={this._handleChange}
            type="checkbox"
          />
            Dropup menu

          <input checked={!!minLength}
            name="minLength"
            onChange={this._handleChange}
            type="checkbox"
          />
            Require minimum input before showing results (2 chars)

          <input checked={emptyLabel}
            name="emptyLabel"
            onChange={this._handleChange}
            type="checkbox"
          />
            Hide the menu when there are no results

          <input checked={selectHintOnEnter}
            name="selectHintOnEnter"
            onChange={this._handleChange}
            type="checkbox"
          />
            Select the hinted result by pressing enter

          <input checked={highlightOnlyResult}
            name="highlightOnlyResult"
            onChange={this._handleChange}
            type="checkbox"
          />
            Highlight the only result

        </FormGroup>
      </div>
    );
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    const newState = {[name]: checked};

    if (name === 'minLength') {
      newState.minLength = checked ? 2 : 0;
    }

    this.setState(newState);
  }
}
/* example-end */

export default BasicBehaviorsExample;
