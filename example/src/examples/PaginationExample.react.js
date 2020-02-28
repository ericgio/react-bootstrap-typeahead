/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import { range } from 'lodash';
import React, { Fragment, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';

/* eslint-disable no-console */
/* example-start */
const options = range(0, 1000).map((o) => `Item ${o}`);

const PaginationExample = () => {
  const [paginate, setPaginate] = useState(true);

  return (
    <Fragment>
      <Typeahead
        id="pagination-example"
        onPaginate={(e) => console.log('Results paginated')}
        options={options}
        paginate={paginate}
        placeholder="Pick a number..."
      />
      <FormGroup>
        <Control
          checked={paginate}
          onChange={(e) => setPaginate(!!e.target.checked)}
          type="checkbox">
          Paginate results
        </Control>
      </FormGroup>
    </Fragment>
  );
};
/* example-end */
/* eslint-enable no-console */

export default PaginationExample;
