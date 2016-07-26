'use strict';

import cx from 'classnames';
import React from 'react';

const Menu = props => (
  <ul
    {...props}
    className={cx('dropdown-menu', props.className)}>
    {props.children}
  </ul>
);

export default Menu;
