/* eslint-disable import/no-extraneous-dependencies */

import React, { Fragment } from 'react';
import { FormGroup } from 'react-bootstrap';

import { AsyncTypeahead } from '../../src';
import Control from '../components/Control.react';
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
        <FormGroup>
          {this._renderCheckboxes()}
        </FormGroup>
      </Fragment>
    );
  }

  _renderCheckboxes() {
    const checkboxes = [
      { label: 'Multi-Select', name: 'multiple' },
      { label: 'Allow custom selections', name: 'allowNew' },
    ];

    return checkboxes.map(({ label, name }) => (
      <Control
        checked={this.state[name]}
        key={name}
        name={name}
        onChange={this._handleChange}
        type="checkbox">
        {label}
      </Control>
    ));
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
