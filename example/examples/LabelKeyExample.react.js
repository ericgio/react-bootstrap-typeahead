import React from 'react';
import {Typeahead} from '../../src/';

/* example-start */
class LabelKeyExample extends React.Component {
  render() {
    return (
      <Typeahead
        labelKey={(option) => `${option.firstName} ${option.lastName}`}
        options={[
          {firstName: 'Art', lastName: 'Blakey'},
          {firstName: 'John', lastName: 'Coltrane'},
          {firstName: 'Miles', lastName: 'Davis'},
          {firstName: 'Herbie', lastName: 'Hancock'},
          {firstName: 'Charlie', lastName: 'Parker'},
          {firstName: 'Tony', lastName: 'Williams'},
        ]}
        placeholder="Who's the coolest cat?"
      />
    );
  }
}
/* example-end */

export default LabelKeyExample;
