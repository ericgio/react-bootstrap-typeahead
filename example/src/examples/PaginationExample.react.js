/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import { range } from 'lodash';
import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import Control from '../components/Control.react';

/* eslint-disable no-console */
/* example-start */
const options = range(0, 1000).map((o) => `Item ${o}`);

class PaginationExample extends React.Component {
  state = {
    paginate: true,
  };

  render() {
    const { paginate } = this.state;

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
            onChange={(e) => this.setState({ paginate: !!e.target.checked })}
            type="checkbox">
            Paginate results
          </Control>
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */
/* eslint-enable no-console */

export default PaginationExample;
