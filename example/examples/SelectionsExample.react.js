import React from 'react';

import { Typeahead } from '../../src';
import options from '../exampleData';

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
