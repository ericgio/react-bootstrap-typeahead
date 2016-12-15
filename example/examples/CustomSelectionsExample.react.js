import React from 'react';
import {Typeahead} from '../../src/';

/* example-start */
const CustomSelectionsExample = React.createClass({
  render() {
    return (
      <Typeahead
        allowNew
        multiple
        newSelectionPrefix="Add a new item: "
        options={[]}
        placeholder="Type anything..."
      />
    );
  },
});
/* example-end */

export default CustomSelectionsExample;
