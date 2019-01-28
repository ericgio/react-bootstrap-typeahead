/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import {AutoAffix} from 'react-overlays';
import {Nav} from 'react-bootstrap';

const PageMenu = (props) => (
  <AutoAffix viewportOffsetTop={50}>
    <div
      className="bs-docs-sidebar hidden-print hidden-xs hidden-sm"
      role="complementary">
      <Nav className="bs-docs-sidenav flex-column">
        {props.children}
      </Nav>
      <a className="back-to-top" href="#top">
        Back to top
      </a>
    </div>
  </AutoAffix>
);

export default PageMenu;
