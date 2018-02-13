import React from 'react';

import {Typeahead} from '../../src/';
import options from '../../example/exampleData';

/* example-start */
class ControlledExample extends React.Component {
  state = {
    value: '',
  };


  handleInputChange = (text) => {
    this.setState({value: text});
  }

  handleSelectOption = (option) => {
    if (option.length === 1) {
      this.setState({value: option[0].name});
    }
    else {
      this.setState({value: ''});
    }
  }

  _clearValue = () => {
    this.setState({value: ''});
  }
  _changeValue = () => {
    this.setState({value: 'California'});

  }
  render() {
    const {value} = this.state;

    return (
      <div>
        <Typeahead
          labelKey="name"
          onChange={this.handleSelectOption}
          onInputChange={this.handleInputChange}
          options={options}
          placeholder="Choose a state..."
          selected={[{name: value}]}
        />
        <button onClick={this._clearValue}>Clear</button>
        <button onClick={this._changeValue}>Change selected</button>

      </div>
    );
  }
}
/* example-end */

export default ControlledExample;