import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class ControlledExample extends React.Component {
  state = {
    value: ''
  };


  handleInputChange = (text) => {
    this.setState({ value: text });
  }

  handleSelectOption = (option) => {
    if (option.length == 1) {
      this.setState({ value: option[0].name });      
    }
    else {
      this.setState({value: ''})
    }
  }

  _clearValue = () => {
    this.setState({ value: '' });
  }
  _changeValue = () => {
    this.setState({ value: 'California' });

  }
  render() {
    const {value} = this.state;

    return (
      <div>
        <Typeahead
          labelKey="name"
          options={options}
          placeholder="Choose a state..."
          onInputChange={this.handleInputChange}
          onChange={this.handleSelectOption}
          selected={[{ name: value }]}
        />
          <button onClick={this._clearValue}>Clear</button>
        <button onClick={this._changeValue}>Change selected</button>
        
      </div>
    );
  }
}
/* example-end */

export default ControlledExample;
