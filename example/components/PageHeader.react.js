import React from 'react';
import {Nav, NavItem, Navbar} from 'react-bootstrap';

const PageHeader = () => (
  <Navbar className="bs-docs-nav navbar-toggleable-sm" inverse staticTop>
    <Navbar.Header className="d-flex justify-content-between hidden-md-up">
      <Navbar.Brand>
        React Bootstrap Typeahead
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem
          href="https://github.com/ericgio/react-bootstrap-typeahead"
          target="_blank">
          GitHub
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default PageHeader;
