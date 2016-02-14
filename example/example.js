'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Token from '../src/Token.react';
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

  getInitialState: function() {
    return {
      multiple: false,
      preSelected: false,
      selected: [],
    };
  },

  render: function() {
    const {multiple, preSelected, selected} = this.state;

    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h2>React Bootstrap Typeahead Example</h2>
          </div>
        </div>
        <div className="container">
          <Typeahead
            selected={selected}
            multiple={multiple}
            onChange={(selected) => {
              this.setState({selected});
            }}
            options={states}
            placeholder="Choose a state..."
          />
          <div style={{margin: '20px 0 0 0'}}>
            <h4>Options</h4>
            <div className="form-group">
              <div className="checkbox">
                <label>
                  <input
                    checked={multiple}
                    onChange={this._handleMultipleChange}
                    type="checkbox"
                  />
                  Multiple Selections
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    checked={preSelected}
                    onChange={this._handlePreSelectionChange}
                    type="checkbox"
                  />
                  Pre-Selected Options
                </label>
              </div>
            </div>
          </div>
          <div style={{margin: '20px 0 0 0'}}>
            <h4>Selected State(s)</h4>
            {selected.map(this._renderSelections)}
          </div>
        </div>
      </div>
    );
  },

  _renderSelections: function(state) {
    return (
      <div
        key={state.id}
        style={{
          display: 'inline-block',
          margin: '0 3px 0 0',
        }}>
        <Token>{state.label}</Token>
      </div>
    );
  },

  _handleMultipleChange: function(e) {
    let {checked} = e.target;
    let newSelection = this.state.selected.slice();
    
    if (!checked) {
      newSelection.splice(1, newSelection.length);
    }

    this.setState({
      multiple: checked,
      selected: newSelection || [],
    });
  },

  _handlePreSelectionChange: function(e) {
    let count = this.state.multiple ? 4 : 1;
    let {checked} = e.target;

    this.setState({
      preSelected: checked,
      selected: checked ? states.slice(0, count) : [],
    });
  },
});

ReactDOM.render(<Example />, document.getElementById('root'));
