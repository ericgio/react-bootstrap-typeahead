import fetch from 'isomorphic-fetch';
import React from 'react';

import {AsyncTypeahead} from '../../src/';

// Polyfill Promises for IE and older browsers.
require('es6-promise').polyfill();

/* example-start */
const AsyncExample = React.createClass({
  getInitialState() {
    return {
      options: [],
    };
  },

  render() {
    return (
      <AsyncTypeahead
        labelKey="login"
        onSearch={this._handleSearch}
        options={this.state.options}
        placeholder="Search for a Github user..."
        renderMenuItemChildren={(option, props, index) => (
          <div>
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
        )}
      />
    );
  },

  _handleSearch(query) {
    if (!query) {
      return;
    }

    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(resp => resp.json())
      .then(json => this.setState({options: json.items}));
  },
});
/* example-end */

export default AsyncExample;
