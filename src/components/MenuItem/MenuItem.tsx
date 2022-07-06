import cx from 'classnames';
import React, { forwardRef, HTMLAttributes, MouseEvent } from 'react';

import { useItem, UseItemProps } from '../../behaviors/item';

export interface BaseMenuItemProps extends HTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
  href?: string;
}

export const BaseMenuItem = forwardRef<HTMLAnchorElement, BaseMenuItemProps>(
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

export type MenuItemProps = UseItemProps<HTMLAnchorElement>;

export default function MenuItem(props: MenuItemProps) {
  return <BaseMenuItem {...useItem(props)} />;
}
