'use strict';

import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';
import {findDOMNode} from 'react-dom';

const MenuItem = React.createClass({
  displayName: 'MenuItem',

  getDefaultProps() {
    return {
      onClick: noop,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      // This ensures that if the menu items exceed the max-height of the menu,
      // the menu will scroll up or down as the user hits the arrow keys.
      findDOMNode(this).firstChild.focus();
    }
  },

  render() {
    const {active, children, className, disabled} = this.props;

    return (
      <li
        className={cx({
          'active': active,
          'disabled': disabled,
        }, className)}>
        <a href="#" onClick={this._handleClick}>
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

export default MenuItem;
