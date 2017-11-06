import React from 'react';
import {Radio} from 'reactstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class CustomFilteringExample extends React.Component {
  state = {
    filterBy: 'callback',
  };

  render() {
    const {filterBy} = this.state;
    const radios = [
      {label: 'Use callback', value: 'callback'},
      {label: 'Use data fields', value: 'fields'},
    ];

    const filterByCallback = (option, text) => {
      return (
        option.capital.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
        option.name.toLowerCase().indexOf(text.toLowerCase()) !== -1
      );
    };

    const filterByFields = ['capital', 'name'];

    return (
      <div>
        <Typeahead
          filterBy={filterBy === 'callback' ? filterByCallback : filterByFields}
          labelKey="name"
          options={options}
          placeholder="Filter by state name or capital..."
          renderMenuItemChildren={(option) => (
            <div>
              {option.name}
              <div>
                <small>Capital: {option.capital}</small>
              </div>
            </div>
          )}
        />
        {radios.map(({label, value}) => (
          <span key={value}>
            <input checked={filterBy === value}
              key={value}
              onChange={(e) => this.setState({filterBy: value})}
              type="radio"
              value={value}
            />
            {label}
          </span>
        ))}
      </div>
    );
  }
}
/* example-end */

export default CustomFilteringExample;
