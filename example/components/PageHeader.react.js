import React from 'react';
import {Nav, NavItem, Navbar} from 'react-bootstrap';

const PageHeader = () => (
  <Navbar className="bs-docs-nav" inverse staticTop>
    <Navbar.Header>
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
