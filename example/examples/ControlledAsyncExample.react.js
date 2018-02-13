import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {AsyncTypeahead} from '../../src/';
import GithubMenuItem from '../components/GithubMenuItem.react';
import makeAndHandleRequest from '../util/makeAndHandleRequest';

/* example-start */
class ControlledAsyncExample extends React.Component {
  state = {
    value: '',
    isLoading: false,
    options: []
  };


  _handleInputChange = (text) => {
    this.setState({ value: text });
  }

  _handleSelectOption = (option) => {
    
    if (option.length == 1) {
      this.setState({ value: option[0].login });      
    }
    else {
      this.setState({value: ''})
    }
  }
  _handleSearch = (query) => {
    this.setState({isLoading: true});
    makeAndHandleRequest(query)
      .then(({options}) => {
        this.setState({
          isLoading: false,
          options,
        });
      });
  }
  _clearValue = () => {
    this.setState({ value: '' });
  }
  _changeValue = () => {
    this.setState({ value: 'ericgio' });

  }
  render() {
    const {value} = this.state;

    return (
      <div>
        <AsyncTypeahead
          isLoading={this.state.isLoading}
          options={this.state.options}
          labelKey="login"
          minLength={2}
          onSearch={this._handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => (
            <GithubMenuItem key={option.id} user={option} />
          )}          
          onInputChange={this._handleInputChange}
          onChange={this._handleSelectOption}
          selected={[value]}
          
        />

        <button onClick={this._clearValue}>Clear</button>
        <button onClick={this._changeValue}>Change selected</button>
        
      </div>
    );
  }
}
/* example-end */

export default ControlledAsyncExample;
