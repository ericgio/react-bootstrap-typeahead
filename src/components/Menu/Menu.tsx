import cx from 'classnames';
import React, { Children, HTMLProps, ReactNode, Ref } from 'react';

import { BaseMenuItem } from '../MenuItem';

import { Id } from '../../types';
import { preventInputBlur } from '../../utils';

const MenuDivider = () => <div className="dropdown-divider" role="separator" />;

const MenuHeader = (props: HTMLProps<HTMLDivElement>) => (
  // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
  <div {...props} className="dropdown-header" role="heading" />
);

export interface MenuProps extends HTMLProps<HTMLDivElement> {
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel?: ReactNode;
  /**
   * Needed for accessibility.
   */
  id?: Id;
  innerRef?: Ref<HTMLDivElement>;
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight?: string;
}

/**
 * Menu component that handles empty state when passed a set of results.
 */
const Menu = ({
  emptyLabel = 'No matches found.',
  innerRef,
  maxHeight = '300px',
  style,
  ...props
}: MenuProps) => {
  const children = Children.toArray(props.children).filter(Boolean).length ? (
    props.children
  ) : (
    <BaseMenuItem disabled role="option">
      {emptyLabel}
    </BaseMenuItem>
  );

  return (
    /* eslint-disable jsx-a11y/interactive-supports-focus */
    <div
      {...props}
      aria-label={props['aria-label'] || 'menu-options'}
      className={cx('rbt-menu', 'dropdown-menu', 'show', props.className)}
      onMouseDown={
        // Prevent input from blurring when clicking on the menu scrollbar.
        preventInputBlur
      }
      ref={innerRef}
      role="listbox"
      style={{
        ...style,
        display: 'block',
        maxHeight,
        overflow: 'auto',
      }}>
      {children}
    </div>
    /* eslint-enable jsx-a11y/interactive-supports-focus */
  );
};

Menu.Divider = MenuDivider;
Menu.Header = MenuHeader;

export default Menu;
