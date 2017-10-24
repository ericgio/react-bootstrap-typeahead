import fetch from 'isomorphic-fetch';
import React from 'react';
import {Checkbox} from 'react-bootstrap';

import {AsyncTypeahead} from '../../src/';

// Polyfill Promises for IE and older browsers.
require('es6-promise').polyfill();

/* example-start */
class AsyncExample extends React.Component {
  state = {
    allowNew: false,
    multiple: false,
    options: [],
  };

  render() {
    return (
      <div>
        <AsyncTypeahead
          {...this.state}
          labelKey="login"
          minLength={1}
          onSearch={this._handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={this._renderMenuItemChildren}
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
      <Checkbox
        checked={this.state[name]}
        key={name}
        name={name}
        onChange={this._handleChange}>
        {label}
      </Checkbox>
    ));
  }

  _renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.id}>
        <img
          src={option.avatar_url}
          style={{
            height: '24px',
            marginRight: '10px',
            width: '24px',
          }}
        />
        <span>{option.login}</span>
      </div>
    );
  }

  _handleChange = (e) => {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
  }

  _handleSearch = (query) => {
    if (!query) {
      return;
    }

    fetch(`https://api.github.com/search/users?q=${query}+in:login`)
      .then((resp) => resp.json())
      .then((json) => {
        const options = json.items.map((i) => ({
          avatar_url: i.avatar_url,
          id: i.id,
          login: i.login,
        }));
        this.setState({options});
      });
  }
}
/* example-end */

export default AsyncExample;
