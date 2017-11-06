import React from 'react';
import {Radio} from 'reactstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class InputSizeExample extends React.Component {
  state = {
    bsSize: undefined,
  };

  render() {
    const {bsSize} = this.state;
    const radios = [
      {label: 'Small', value: 'small'},
      {label: 'Default', value: undefined},
      {label: 'Large', value: 'large'},
    ];

    return (
      <div>
        <Typeahead
          bsSize={bsSize}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        {radios.map(({label, value}) => (
          <span key={value || 'default'}>
            <input checked={bsSize === value}
              key={value || 'default'}
              onChange={(e) => this.setState({bsSize: value})}
              type="radio"
              value={value}
            />
            <label>{label}</label>
          </span>
        ))}
      </div>
    );
  }
}
/* example-end */

export default InputSizeExample;
