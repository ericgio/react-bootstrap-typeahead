import React from 'react';
import {Nav, NavItem, Navbar} from 'react-bootstrap';

import {version} from '../../package.json';

const GITHUB_URL = 'https://github.com/ericgio/react-bootstrap-typeahead';

const PageHeader = () => (
  <Navbar className="bs-docs-nav navbar-toggleable-sm" inverse staticTop>
    <Navbar.Header className="d-flex justify-content-between hidden-md-up">
      <Navbar.Brand>
        React Bootstrap Typeahead
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem
          href={`${GITHUB_URL}/releases`}
          target="_blank">
          v{version}
        </NavItem>
        <NavItem
          href={GITHUB_URL}
          target="_blank">
          GitHub
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default PageHeader;
