import cx from 'classnames';
import React, { forwardRef, HTMLProps, MouseEvent } from 'react';

import { useItem, UseItemProps } from '../behaviors/item';

export interface MenuItemProps extends HTMLProps<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
}

export const BaseMenuItem = forwardRef<HTMLAnchorElement, MenuItemProps>(
  ({ active, children, className, disabled, onClick, ...props }, ref) => {
    return (
      <a
        {...props}
        className={cx('dropdown-item', { active, disabled }, className)}
        href={props.href || '#'}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          !disabled && onClick && onClick(e);
        }}
        ref={ref}>
        {children}
      </a>
    );
  }
);

export default function MenuItem(props: UseItemProps<HTMLAnchorElement>) {
  return <BaseMenuItem {...props} {...useItem(props)} />;
}
