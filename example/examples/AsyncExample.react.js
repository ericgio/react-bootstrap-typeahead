import React from 'react';
// import {Checkbox} from 'reactstrap';

import {AsyncTypeahead} from '../../src/';
import GithubMenuItem from '../components/GithubMenuItem.react';
import makeAndHandleRequest from '../util/makeAndHandleRequest';

/* example-start */
class AsyncExample extends React.Component {
  state = {
    allowNew: false,
    isLoading: false,
    multiple: false,
    options: [],
  };

  render() {
    return (
      <div>
        <AsyncTypeahead
          {...this.state}
          labelKey="login"
          minLength={2}
          onSearch={this._handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => (
            <GithubMenuItem key={option.id} user={option} />
          )}
        />
        {this._renderCheckboxes()}
      </div>
    );
  }

  _renderCheckboxes() {
    const checkboxes = [
      {label: 'Multi-Select', name: 'multiple'},
      {label: 'Allow custom selections', name: 'allowNew'},
    ];

    return checkboxes.map(({label, name}) => (
      <span key={name}>
        <input checked={this.state[name]}
          key={name}
          name={name}
          onChange={this._handleChange}
          type="checkbox"
        />
        <label>{label}</label>
      </span>
    ));
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
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
}
/* example-end */

export default AsyncExample;
