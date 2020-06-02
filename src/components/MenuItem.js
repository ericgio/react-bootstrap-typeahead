// @flow

import cx from 'classnames';
import React, { type Node } from 'react';

import { withItem } from '../behaviors/item';

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
  return (
    /* eslint-disable jsx-a11y/anchor-is-valid */
    <a
      {...props}
      className={cx('dropdown-item', { active, disabled }, className)}
      href="#"
      onClick={(e: SyntheticEvent<HTMLElement>) => {
        e.preventDefault();
        !disabled && onClick && onClick(e);
      }}
      onMouseDown={onMouseDown}
      ref={ref}>
      {children}
    </a>
    /* eslint-enable jsx-a11y/anchor-is-valid */
  );
});

export { BaseMenuItem };
export default withItem(BaseMenuItem);
