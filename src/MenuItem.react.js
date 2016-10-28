'use strict';

import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import menuItemBehaviors from './containers/menuItemBehaviors';

const BaseMenuItem = React.createClass({
  displayName: 'BaseMenuItem',

  getDefaultProps() {
    return {
      onClick: noop,
    };
  },

  render() {
    const {active, children, className, disabled} = this.props;

    return (
      <li
        className={cx({
          'active': active,
          'disabled': disabled,
        }, className)}>
        <a onClick={this._handleClick} role="button">
          {children}
        </a>
      </li>
    );
  },

  _handleClick(e) {
    const {disabled, onClick} = this.props;

    e.preventDefault();
    !disabled && onClick(e);
  },
});

export {BaseMenuItem};

const MenuItem = menuItemBehaviors(BaseMenuItem);

export default MenuItem;
