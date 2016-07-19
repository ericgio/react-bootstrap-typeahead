'use strict';

import React from 'react';

const Menu = props => (
  <ul
    {...props}
    className={props.className}>
    {props.children}
  </ul>
);

export default Menu;
