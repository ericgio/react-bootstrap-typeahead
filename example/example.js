'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/Typeahead.react';

let states = [
  'Alabama',
  'Alaska',
  'Arkansas',
  'Arizona',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Dakota',
  'South Carolina',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];
states = states.map((state, idx) => {
  return {
    id: idx,
    label: state,
  };
});

const Example = React.createClass({

  getInitialState() {
    return {
      disabled: false,
      multiple: false,
      preSelected: false,
      selected: [],
    };
  },

  render() {
    const {allowNew, disabled, multiple, preSelected, selected} = this.state;

    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h2>React Bootstrap Typeahead Example</h2>
          </div>
        </div>
        <div className="container">
          <Typeahead
            allowNew={allowNew}
            disabled={disabled}
            multiple={multiple}
            onChange={(selected) => this.setState({selected})}
            options={states}
            placeholder="Choose a state..."
            selected={selected}
          />
          <div style={{margin: '20px 0 0 0'}}>
            <h4>Options</h4>
            <div className="form-group">
              <div className="checkbox">
                <label>
                  <input
                    checked={disabled}
                    name="disabled"
                    onChange={this._handleChange}
                    type="checkbox"
                  />
                  Disabled
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    checked={multiple}
                    name="multiple"
                    onChange={this._handleChange}
                    type="checkbox"
                  />
                  Multiple Selections
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    checked={preSelected}
                    name="preSelected"
                    onChange={this._handleChange}
                    type="checkbox"
                  />
                  Pre-Selected Options
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    checked={allowNew}
                    name="allowNew"
                    onChange={this._handleChange}
                    type="checkbox"
                  />
                  Allow Custom Options
                </label>
              </div>
            </div>
          </div>
          <div style={{margin: '20px 0 0 0'}}>
            <h4>Selected State(s)</h4>
            {selected.map((state) => state.label).join(', ')}
          </div>
        </div>
      </div>
    );
  },

  _handleChange(e) {
    const {checked, name} = e.target;

    let newState = {};
    newState[name] = checked;

    switch (name) {
      case 'preSelected':
        let count = this.state.multiple ? 4 : 1;
        newState.selected = checked ? states.slice(0, count) : [];
        break;
      case 'multiple':
        let newSelection = this.state.selected.slice();
        !checked && newSelection.splice(1, newSelection.length);
        newState.selected = newSelection || [];
        break;
    }

    this.setState(newState);
  },
});

ReactDOM.render(<Example />, document.getElementById('root'));
