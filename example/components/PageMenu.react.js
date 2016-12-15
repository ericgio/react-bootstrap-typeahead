import React from 'react';
import {AutoAffix} from 'react-overlays';
import {Nav} from 'react-bootstrap';

const PageMenu = props => (
  <AutoAffix>
    <div
      className="bs-docs-sidebar hidden-print hidden-xs hidden-sm"
      role="complementary">
      <Nav className="bs-docs-sidenav">
        {props.children}
      </Nav>
      <a className="back-to-top" href="#top">
        Back to top
      </a>
    </div>
  </AutoAffix>
);

export default PageMenu;
