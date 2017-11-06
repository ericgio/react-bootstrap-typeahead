import * as React from 'react';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class MenuAlignExample extends React.Component {
  state = {
    align: 'justify',
  };

  render() {
    const {align} = this.state;
    const radios = [
      {label: 'Justify (default)', value: 'justify'},
      {label: 'Align left', value: 'left'},
      {label: 'Align right', value: 'right'},
    ];

    return (
      <div>
        <Typeahead
          align={align}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        {radios.map(({label, value}) => (
          <span key={value}>
            <input checked={align === value}
              key={value}
              onChange={(e) => this.setState({align: value})}
              type="radio"
              value={value}
            />
            {label}
          </span>
        ))}
      </div>
    );
  }
}
/* example-end */

export default MenuAlignExample;
