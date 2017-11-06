import React from 'react';
// import {Checkbox} from 'reactstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class BasicExample extends React.Component {
  state = {
    multiple: false,
  };

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
        <label>Multi-Select</label>
        <input checked={multiple}
          onChange={(e) => this.setState({multiple: e.target.checked})}
          type="checkbox"
        />
      </div>
    );
  }
}
/* example-end */

export default BasicExample;
