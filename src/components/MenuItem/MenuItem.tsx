import cx from 'classnames';
import React, { forwardRef, HTMLAttributes, MouseEvent } from 'react';

import { useItem, UseItemProps } from '../../behaviors/item';
import {OptionType} from "../../types";

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

export type MenuItemProps<Option extends OptionType> = UseItemProps<HTMLAnchorElement, Option>;

export default function MenuItem<Option extends OptionType>(props: MenuItemProps<Option>) {
  return <BaseMenuItem {...useItem(props)} />;
}
