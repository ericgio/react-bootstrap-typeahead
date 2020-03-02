/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

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
    const checkboxes = [
      { label: 'Multi-Select', name: 'multiple' },
      { label: 'Allow custom selections', name: 'allowNew' },
    ];

    return (
      <Fragment>
        <AsyncTypeahead
          {...this.state}
          id="async-example"
          labelKey="login"
          minLength={3}
          onSearch={this._handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => (
            <GithubMenuItem key={option.id} user={option} />
          )}
        />
        <Form.Group>
          {checkboxes.map(({ label, name }) => (
            <Form.Check
              checked={this.state[name]}
              id={name}
              key={name}
              label={label}
              name={name}
              onChange={this._handleChange}
              type="checkbox"
            />
          ))}
        </Form.Group>
      </Fragment>
    );
  }

  _handleChange = (e) => {
    const { checked, name } = e.target;
    this.setState({ [name]: checked });
  }

  _handleSearch = (query) => {
    this.setState({ isLoading: true });
    makeAndHandleRequest(query)
      .then(({ options }) => {
        this.setState({
          isLoading: false,
          options,
        });
      });
  }
}
/* example-end */

export default AsyncExample;
