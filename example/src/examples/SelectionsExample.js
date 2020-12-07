/* eslint-disable import/no-unresolved,no-console */

import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const SelectionsExample = (props) => (
  <Typeahead
    clearButton
    defaultSelected={options.slice(0, 1)}
    id="selections-example"
    labelKey="name"
    onInputChange={(text, e) => { console.log(text, e); }}
    options={options}
    placeholder="Choose a state..."
  />
);
/* example-end */

export default SelectionsExample;
