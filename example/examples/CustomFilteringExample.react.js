import React, {Fragment} from 'react';
import {FormGroup} from 'react-bootstrap';

import Control from '../components/Control';
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

    const filterByCallback = (option, props) => {
      return (
        option.capital.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
        option.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
      );
    };

    const filterByFields = ['capital', 'name'];

    return (
      <Fragment>
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
        <FormGroup>
          {radios.map(({label, value}) => (
            <Control
              checked={filterBy === value}
              key={value}
              onChange={(e) => this.setState({filterBy: value})}
              type="radio"
              value={value}>
              {label}
            </Control>
          ))}
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default CustomFilteringExample;
