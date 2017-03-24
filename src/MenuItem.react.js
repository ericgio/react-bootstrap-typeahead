'use strict';

import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import menuItemContainer from './containers/menuItemContainer';

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
        <a onTouchStart={this._handleClick} onClick={this._handleClick} role="button">
          {children}
        </a>
      </li>
    );
  },

  _handleClick(e) {
    const {disabled, onClick} = this.props;

    if (e.type === 'touchstart') {
      e.stopPropagation();
    } else {
      e.preventDefault();
    }

    !disabled && onClick(e);
  },
});

const MenuItem = menuItemContainer(BaseMenuItem);

export {BaseMenuItem};
export default MenuItem;
