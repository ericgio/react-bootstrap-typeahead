import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { TypeaheadState } from 'react-bootstrap-typeahead/types';

import options, { Option } from '../data';

/* example-start */
const CustomFilteringExample = () => {
  const [filterBy, setFilterBy] = useState('callback');

  const radios = [
    { label: 'Use callback', value: 'callback' },
    { label: 'Use data fields', value: 'fields' },
  ];

  const filterByCallback = (option: Option, props: TypeaheadState) =>
    option.capital.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
    option.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;

  const filterByFields = ['capital', 'name'];

  return (
    <>
      <Typeahead
        filterBy={filterBy === 'callback' ? filterByCallback : filterByFields}
        id="custom-filtering-example"
        labelKey="name"
        options={options}
        placeholder="Filter by state name or capital..."
        renderMenuItemChildren={(o) => {
          const option = o as Option;
          return (
            <div>
              {option.name}
              <div>
                <small>Capital: {option.capital}</small>
              </div>
            </div>
          );
        }}
      />
      <Form.Group className="mt-3">
        {radios.map(({ label, value }) => (
          <Form.Check
            checked={filterBy === value}
            id={value}
            key={value}
            label={label}
            onChange={() => setFilterBy(value)}
            type="radio"
            value={value}
          />
        ))}
      </Form.Group>
    </>
  );
};
/* example-end */

export default CustomFilteringExample;
