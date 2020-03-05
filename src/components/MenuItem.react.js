// @flow

import cx from 'classnames';
import React, { type Node } from 'react';

import menuItemContainer from '../containers/menuItemContainer';

import type { EventHandler } from '../types';

type MenuItemProps = {
  active?: boolean,
  children?: Node,
  className?: string,
  disabled?: boolean,
  onClick?: EventHandler<HTMLElement>,
  onMouseDown?: EventHandler<HTMLElement>,
};

const BaseMenuItem = React.forwardRef<MenuItemProps, ?HTMLElement>((
  { active, children, className, disabled, onClick, onMouseDown, ...props },
  ref
) => {
  const conditionalClassNames = {
    active,
    disabled,
  };

  return (
    /* eslint-disable jsx-a11y/anchor-is-valid */
    <li
      {...props}
      className={cx(conditionalClassNames, className)}
      ref={ref}>
      <a
        className={cx('dropdown-item', conditionalClassNames)}
        href="#"
        onClick={(e: SyntheticEvent<HTMLElement>) => {
          e.preventDefault();
          !disabled && onClick && onClick(e);
        }}
        onMouseDown={onMouseDown}>
        {children}
      </a>
    </li>
    /* eslint-enable jsx-a11y/anchor-is-valid */
  );
});

export { BaseMenuItem };
export default menuItemContainer(BaseMenuItem);
