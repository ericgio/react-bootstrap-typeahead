import React from 'react';
import {Radio} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
const InputSizeExample = React.createClass({
  getInitialState() {
    return {
      bsSize: undefined,
    };
  },

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
          <Radio
            checked={bsSize === value}
            key={value || 'default'}
            onChange={e => this.setState({bsSize: value})}
            value={value}>
            {label}
          </Radio>
        ))}
      </div>
    );
  },
});
/* example-end */

export default InputSizeExample;
