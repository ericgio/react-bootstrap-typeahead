/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Nav } from 'react-bootstrap';

const PageMenu = (props) => (
  <div className="bs-docs-sidebar hidden-print hidden-xs hidden-sm">
    <Nav className="bs-docs-sidenav flex-column">
      {props.children}
    </Nav>
    <a className="back-to-top" href="#top">
      Back to top
    </a>
  </div>
);

export default PageMenu;
