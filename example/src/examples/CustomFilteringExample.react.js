/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';
import options from '../data';

/* example-start */
const CustomFilteringExample = () => {
  const [filterBy, setFilterBy] = useState('callback');

  const radios = [
    { label: 'Use callback', value: 'callback' },
    { label: 'Use data fields', value: 'fields' },
  ];

  const filterByCallback = (option, props) => (
    option.capital.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
    option.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
  );

  const filterByFields = ['capital', 'name'];

  return (
    <Fragment>
      <Typeahead
        filterBy={filterBy === 'callback' ? filterByCallback : filterByFields}
        id="custom-filtering-example"
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
        {radios.map(({ label, value }) => (
          <Control
            checked={filterBy === value}
            key={value}
            onChange={(e) => setFilterBy(value)}
            type="radio"
            value={value}>
            {label}
          </Control>
        ))}
      </FormGroup>
    </Fragment>
  );
};
/* example-end */

export default CustomFilteringExample;
