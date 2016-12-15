import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
const BasicExample = React.createClass({
  getInitialState() {
    return {
      multiple: false,
    };
  },

  render() {
    const {multiple} = this.state;

    return (
      <div>
        <Typeahead
          labelKey="name"
          multiple={multiple}
          options={options}
          placeholder="Choose a state..."
        />
        <Checkbox
          checked={multiple}
          onChange={e => this.setState({multiple: e.target.checked})}>
          Multi-Select
        </Checkbox>
      </div>
    );
  },
});
/* example-end */

export default BasicExample;
