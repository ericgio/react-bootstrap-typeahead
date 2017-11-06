import {range} from 'lodash';
import * as React from 'react';

import {Typeahead} from '../../src/';

/* eslint-disable no-console */
/* example-start */
class LabelKeyExample extends React.Component {
  state = {
    paginate: true,
  };

  render() {
    const {paginate} = this.state;

    return (
      <div>
        <Typeahead
          onPaginate={(e) => console.log('Results paginated')}
          options={range(0, 1000).map((o) => o.toString())}
          paginate={paginate}
          placeholder="Pick a number..."
        />
        <span>
          <input checked={paginate}
            onChange={(e) => this.setState({paginate: !!e.target.checked})}
            type="checkbox"
          />
          <label>Paginate results</label>
        </span>
      </div>
    );
  }
}
/* example-end */
/* eslint-disable no-console */

export default LabelKeyExample;
