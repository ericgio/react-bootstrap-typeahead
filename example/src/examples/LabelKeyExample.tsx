import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

/* example-start */
interface Option {
  firstName: string;
  lastName: string;
}

const options: Option[] = [
  { firstName: 'Art', lastName: 'Blakey' },
  { firstName: 'John', lastName: 'Coltrane' },
  { firstName: 'Miles', lastName: 'Davis' },
  { firstName: 'Herbie', lastName: 'Hancock' },
  { firstName: 'Charlie', lastName: 'Parker' },
  { firstName: 'Tony', lastName: 'Williams' },
];

const LabelKeyExample = () => (
  <Typeahead
    id="labelkey-example"
    labelKey={(option: Option) => `${option.firstName} ${option.lastName}`}
    options={options}
    placeholder="Who's the coolest cat?"
  />
);
/* example-end */

export default LabelKeyExample;
