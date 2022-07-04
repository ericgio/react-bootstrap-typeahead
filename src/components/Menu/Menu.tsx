import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Children, HTMLProps, ReactNode, Ref } from 'react';

import { BaseMenuItem } from '../MenuItem';

import { preventInputBlur } from '../../utils';
import { checkPropType, isRequiredForA11y } from '../../propTypes';

const MenuDivider = () => <div className="dropdown-divider" role="separator" />;

const MenuHeader = (props: HTMLProps<HTMLDivElement>) => (
  // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
  <div {...props} className="dropdown-header" role="heading" />
);

const propTypes = {
  'aria-label': PropTypes.string,
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: PropTypes.node,
  /**
   * Needed for accessibility.
   */
  id: checkPropType(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRequiredForA11y
  ),
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight: PropTypes.string,
};

const defaultProps = {
  'aria-label': 'menu-options',
};

export interface MenuProps extends HTMLProps<HTMLDivElement> {
  emptyLabel?: ReactNode;
  innerRef?: Ref<HTMLDivElement>;
  maxHeight?: string;
  text?: string;
}

/**
 * Menu component that handles empty state when passed a set of results.
 */
const Menu = ({
  emptyLabel = 'No matches found.',
  innerRef,
  maxHeight = '300px',
  style,
  text = '',
  ...props
}: MenuProps) => {
  const children =
    Children.count(props.children) === 0 ? (
      <BaseMenuItem disabled role="option">
        {emptyLabel}
      </BaseMenuItem>
    ) : (
      props.children
    );

  return (
    /* eslint-disable jsx-a11y/interactive-supports-focus */
    <div
      {...props}
      className={cx('rbt-menu', 'dropdown-menu', 'show', props.className)}
      key={
        // Force a re-render if the text changes to ensure that menu
        // positioning updates correctly.
        text
      }
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

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
Menu.Divider = MenuDivider;
Menu.Header = MenuHeader;

export default Menu;
