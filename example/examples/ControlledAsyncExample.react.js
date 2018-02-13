import React from 'react';

import {AsyncTypeahead} from '../../src/';
import GithubMenuItem from '../components/GithubMenuItem.react';
import makeAndHandleRequest from '../util/makeAndHandleRequest';

/* example-start */
class ControlledAsyncExample extends React.Component {
  state = {
    isLoading: false,
    options: [],
    value: '',
  };

  _handleInputChange = (text) => {
    this.setState({value: text});
  }

  _handleSelectOption = (option) => {

    if (option.length === 1) {
      this.setState({value: option[0].login});
    }
    else {
      this.setState({value: ''});
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
    this.setState({value: ''});
  }
  _changeValue = () => {
    this.setState({value: 'ericgio'});

  }
  render() {
    const {value} = this.state;

    return (
      <div>
        <AsyncTypeahead
          isLoading={this.state.isLoading}
          labelKey="login"
          minLength={2}
          onChange={this._handleSelectOption}
          onInputChange={this._handleInputChange}
          onSearch={this._handleSearch}
          options={this.state.options}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => (
            <GithubMenuItem key={option.id} user={option} />
          )}
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