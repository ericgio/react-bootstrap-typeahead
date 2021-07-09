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
  href?: string,
  onClick?: EventHandler<HTMLElement>,
};

const BaseMenuItem = React.forwardRef<MenuItemProps, ?HTMLElement>((
  { active, children, className, disabled, onClick, ...props },
  ref
) => {
  return (
    <a
      {...props}
      className={cx('dropdown-item', { active, disabled }, className)}
      href={props.href || '#'}
      onClick={(e: SyntheticEvent<HTMLElement>) => {
        e.preventDefault();
        !disabled && onClick && onClick(e);
      }}
      ref={ref}>
      {children}
    </a>
  );
});

export { BaseMenuItem };
export default withItem(BaseMenuItem);
