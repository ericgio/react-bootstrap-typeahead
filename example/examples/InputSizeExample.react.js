import React, {Fragment} from 'react';
import {FormGroup} from 'react-bootstrap';

import Control from '../components/Control';
import {Typeahead} from '../../src/';
import options from '../exampleData';

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
      <Fragment>
        <Typeahead
          bsSize={bsSize}
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
        />
        <FormGroup>
          {radios.map(({label, value}) => (
            <Control
              checked={bsSize === value}
              key={value || 'default'}
              onChange={(e) => this.setState({bsSize: value})}
              type="radio"
              value={value}>
              {label}
            </Control>
          ))}
        </FormGroup>
      </Fragment>
    );
  }
}
/* example-end */

export default InputSizeExample;
