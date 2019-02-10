/* eslint-disable import/no-extraneous-dependencies */

import { range } from 'lodash';
import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';

import Control from '../components/Control.react';
import { Typeahead } from '../../src';

/* eslint-disable no-console */
/* example-start */
const options = range(0, 1000).map((o) => o.toString());

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
/* eslint-disable no-console */

export default PaginationExample;
