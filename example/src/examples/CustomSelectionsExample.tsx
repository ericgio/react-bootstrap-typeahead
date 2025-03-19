import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

/* example-start */
const CustomSelectionsExample = () => (
  <Typeahead
    allowNew
    id="custom-selections-example"
    multiple
    newSelectionPrefix="Add a new item: "
    options={[]}
    placeholder="Type anything..."
  />
);
/* example-end */

export default CustomSelectionsExample;
