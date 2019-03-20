/* eslint-disable import/no-unresolved */

import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const SelectionsExample = (props) => (
  <Typeahead
    clearButton
    defaultSelected={options.slice(0, 5)}
    id="selections-example"
    labelKey="name"
    multiple
    options={options}
    placeholder="Choose a state..."
  />
);
/* example-end */

export default SelectionsExample;
