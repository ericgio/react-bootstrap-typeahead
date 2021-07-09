// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Children, type Node } from 'react';

import { BaseMenuItem } from './MenuItem';

import { preventInputBlur } from '../utils';
import { checkPropType, isRequiredForA11y } from '../propTypes';
import type { Id, MenuProps } from '../types';

const MenuDivider = (props: any) => (
  <div className="dropdown-divider" role="separator" />
);

const MenuHeader = (props: any) => (
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
  emptyLabel: 'No matches found.',
  maxHeight: '300px',
};

export type MenuComponentProps = MenuProps & {
  'aria-label': string,
  children?: Node,
  className?: string,
  emptyLabel: Node,
  id: Id,
  maxHeight: string,
  text: string,
};

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends React.Component<MenuComponentProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  static Divider = MenuDivider;
  static Header = MenuHeader;

  componentDidUpdate(prevProps: MenuComponentProps) {
    const { inputHeight, scheduleUpdate } = this.props;

    // Update the menu position if the height of the input changes.
    if (inputHeight !== prevProps.inputHeight) {
      scheduleUpdate();
    }
  }

  render() {
    const {
      children,
      className,
      emptyLabel,
      id,
      innerRef,
      maxHeight,
      style,
      text,
    } = this.props;

    const contents =
      Children.count(children) === 0 ? (
        <BaseMenuItem disabled role="option">
          {emptyLabel}
        </BaseMenuItem>
      ) : (
        children
      );

    return (
      /* eslint-disable jsx-a11y/interactive-supports-focus */
      <div
        aria-label={this.props['aria-label']}
        className={cx('rbt-menu', 'dropdown-menu', 'show', className)}
        id={id}
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
        {contents}
      </div>
      /* eslint-enable jsx-a11y/interactive-supports-focus */
    );
  }
}

export default Menu;
