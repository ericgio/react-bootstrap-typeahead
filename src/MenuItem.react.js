'use strict';

import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';
import {findDOMNode} from 'react-dom';

import scrollIntoViewIfNeeded from './utils/scrollIntoViewIfNeeded';

const MenuItem = React.createClass({
  displayName: 'MenuItem',

  getDefaultProps() {
    return {
      onClick: noop,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      // Ensures that if the menu items exceed the bounds of the menu, the
      // menu will scroll up or down as the user hits the arrow keys.
      scrollIntoViewIfNeeded(findDOMNode(this));
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

export default MenuItem;
