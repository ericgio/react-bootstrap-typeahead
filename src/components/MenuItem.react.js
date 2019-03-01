// @flow

import cx from 'classnames';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { type Node } from 'react';

import menuItemContainer from '../containers/menuItemContainer';

import type { EventHandler } from '../types';

const propTypes = {
  onClick: PropTypes.func,
};

const defaultProps = {
  onClick: noop,
};

type BaseProps = {
  active?: boolean,
  children?: Node,
  className?: string,
  disabled?: boolean,
  onClick: EventHandler,
  onMouseDown?: EventHandler,
};

export class BaseMenuItem extends React.Component<BaseProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  render() {
    const {
      active,
      children,
      className,
      disabled,
      onClick,
      onMouseDown,
      ...props
    } = this.props;

    const conditionalClassNames = {
      active,
      disabled,
    };

    return (
      /* eslint-disable jsx-a11y/anchor-is-valid */
      <li
        {...props}
        className={cx(conditionalClassNames, className)}>
        <a
          className={cx('dropdown-item', conditionalClassNames)}
          href="#"
          onClick={this._handleClick}
          onMouseDown={onMouseDown}>
          {children}
        </a>
      </li>
      /* eslint-enable jsx-a11y/anchor-is-valid */
    );
  }

  _handleClick = (e: SyntheticEvent<HTMLElement>) => {
    const { disabled, onClick } = this.props;

    e.preventDefault();
    !disabled && onClick(e);
  }
}

export default menuItemContainer(BaseMenuItem);
