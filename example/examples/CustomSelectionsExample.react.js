import * as React from 'react';
import {Typeahead} from '../../src/';

/* example-start */
class CustomSelectionsExample extends React.Component {
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
  }
}
/* example-end */

export default CustomSelectionsExample;
