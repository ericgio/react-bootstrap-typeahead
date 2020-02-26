/* eslint-disable import/no-extraneous-dependencies */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

import GitHubLogo from './GitHubLogo.react';
import VersionDropdown from './VersionDropdown.react';

import { version as PACKAGE_VERSION } from '../../../package.json';
import { BS3, BS4 } from '../util/bsVersions';

const GITHUB_URL = 'https://github.com/ericgio/react-bootstrap-typeahead';

class PageHeader extends React.Component {
  static propTypes = {
    onVersionChange: PropTypes.func.isRequired,
    selectedVersion: PropTypes.string.isRequired,
  };

  state = {
    isOpen: false,
    show: false,
  };

  render() {
    const { onVersionChange, selectedVersion } = this.props;
    const { isOpen, show } = this.state;

    const isBS3 = selectedVersion === BS3;

    return (
      <Navbar
        className={cx('bs-docs-nav', 'fixed-top', {
          'navbar-expand-md': !isBS3,
          'navbar-toggleable-sm': isBS3,
        })}
        fixedTop
        inverse
        staticTop>
        {this._renderNavbarHeader(isBS3)}
        <Navbar.Collapse className={cx({ show })}>
          <Nav className="ml-auto" pullRight>
            <NavItem
              href={`${GITHUB_URL}/releases`}
              target="_blank">
              v{PACKAGE_VERSION}
            </NavItem>
            <VersionDropdown
              isOpen={isOpen}
              onSelect={onVersionChange}
              onToggle={() => this.setState({ isOpen: !isOpen })}
              title={`Bootstrap v${selectedVersion.slice(0, 1)}`}>
              {[BS4, BS3].map((bsVersion) => (
                <VersionDropdown.Item
                  eventKey={bsVersion}
                  key={bsVersion}
                  onClick={() => onVersionChange(bsVersion)}>
                  v{bsVersion}
                </VersionDropdown.Item>
              ))}
            </VersionDropdown>
            <NavItem
              aria-label="Github"
              href={GITHUB_URL}
              target="_blank">
              <GitHubLogo style={{ margin: '-4px 0' }} />
              <span className="sr-only">
                Github
              </span>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  _renderNavbarHeader = (isBS3) => {
    const { show } = this.state;

    const contents =
      <Fragment>
        <Navbar.Brand>React Bootstrap Typeahead</Navbar.Brand>
        <Navbar.Toggle
          className={cx('navbar-toggler', { collapsed: !show })}
          onClick={() => this.setState({ show: !show })}
        />
      </Fragment>;

    return isBS3 ?
      <Navbar.Header className="d-flex justify-content-between hidden-md-up">
        {contents}
      </Navbar.Header> :
      contents;
  }
}

export default PageHeader;
