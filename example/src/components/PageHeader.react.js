/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import GitHubLogo from './GitHubLogo.react';

import { version as PACKAGE_VERSION } from '../../../package.json';

const GITHUB_URL = 'https://github.com/ericgio/react-bootstrap-typeahead';

const PageHeader = () => (
  <Navbar
    className="bs-docs-nav"
    expand="md"
    fixed="top"
    variant="dark">
    <Container fluid="md">
      <Navbar.Brand>React Bootstrap Typeahead</Navbar.Brand>
      <Navbar.Toggle>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </Navbar.Toggle>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <Nav.Item>
            <Nav.Link
              href={`${GITHUB_URL}/releases`}
              target="_blank">
              v{PACKAGE_VERSION}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              aria-label="Github"
              href={GITHUB_URL}
              target="_blank">
              <GitHubLogo style={{ margin: '-4px 0' }} />
              <span className="sr-only">
                Github
              </span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default PageHeader;
