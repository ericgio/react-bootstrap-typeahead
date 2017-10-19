import React from 'react';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
const SelectionsExample = (props) => (
  <Typeahead
    clearButton
    defaultSelected={options.slice(0, 5)}
    labelKey="name"
    multiple
    options={options}
    placeholder="Choose a state..."
  />
);
/* example-end */

export default SelectionsExample;
