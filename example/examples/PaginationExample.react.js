import {range} from 'lodash';
import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {Typeahead} from '../../src/';

/* example-start */
const LabelKeyExample = React.createClass({
  getInitialState() {
    return {
      paginate: true,
    };
  },

  render() {
    const {paginate} = this.state;

    return (
      <div>
        <Typeahead
          options={range(0, 1000).map(o => o.toString())}
          paginate={paginate}
          placeholder="Pick a number..."
        />
        <Checkbox
          checked={paginate}
          onChange={e => this.setState({paginate: !!e.target.checked})}>
          Paginate results
        </Checkbox>
      </div>
    );
  },
});
/* example-end */

export default LabelKeyExample;
