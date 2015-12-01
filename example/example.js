import React from 'react';
import ReactDOM from 'react-dom';
import TokenizerInput from '../src/TokenizerInput.react';
import Typeahead from '../src/Typeahead.react';
import TypeaheadInput from '../src/TypeaheadInput.react';
import TypeaheadMenu from '../src/TypeaheadMenu.react';

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
  'Wyoming'
];
states = states.map((state, idx) => {
  return {
    id: idx,
    label: state
  };
});


let Example = React.createClass({

  getInitialState: function() {
    return {
      selected: []
    };
  },

  render: function() {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1>React Bootstrap Typeahead</h1>
          </div>
        </div>
        <div className="container">
          <h3>Typeahead</h3>
          <Typeahead
            onChange={this._handleChange}
            options={states}>
            <TypeaheadInput placeholder="Choose a state..." />
            <TypeaheadMenu />
          </Typeahead>
          <h3>Tokenizer</h3>
          <Typeahead
            defaultSelected={states.slice(0, 3)}
            multiple
            onChange={this._handleChange}
            options={states}>
            <TokenizerInput placeholder="Choose a state..." />
            <TypeaheadMenu />
          </Typeahead>
        </div>
      </div>
    );
  },

  _handleChange: function(selected) {
    this.setState({selected: selected});
  }
});

ReactDOM.render(<Example />, document.getElementById('root'));
