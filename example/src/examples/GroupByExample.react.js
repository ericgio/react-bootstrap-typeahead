/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const GroupByExample = () => {
  const [selected, setSelected] = useState([]);

  return (
    <Fragment>
      <Typeahead
        id="groupby-typeahead-example"
        labelKey="name"
        groupBy="region"
        onChange={setSelected}
        options={options}
        placeholder="Choose a state..."
        selected={selected}
      />
    </Fragment>
  );
};
/* example-end */

export default GroupByExample;
