// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Children, type Node } from 'react';

import { BaseMenuItem } from './MenuItem.react';

import { checkPropType, isRequiredForA11y } from '../propTypes';
import type { MenuProps } from '../core/TypeaheadMenu';

const MenuDivider = (props: any) => (
  <li className="divider dropdown-divider" role="separator" />
);

const MenuHeader = (props: any) => (
  <li {...props} className="dropdown-header" />
);

const propTypes = {
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: PropTypes.node,
  /**
   * Needed for accessibility.
   */
  id: checkPropType(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRequiredForA11y,
  ),
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight: PropTypes.string,
};

const defaultProps = {
  emptyLabel: 'No matches found.',
  maxHeight: '300px',
};

export type MenuComponentProps = {
  children?: Node,
  className?: string,
  emptyLabel: Node,
  maxHeight: string,
};

type Props = MenuProps & MenuComponentProps;

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends React.Component<Props> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  static Divider = MenuDivider;
  static Header = MenuHeader;

  componentDidUpdate(prevProps: Props) {
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

    const contents = Children.count(children) === 0 ?
      <BaseMenuItem disabled>
        {emptyLabel}
      </BaseMenuItem> :
      children;

    return (
      <ul
        className={cx('rbt-menu', 'dropdown-menu', 'show', className)}
        id={id}
        key={
          // Force a re-render if the text changes to ensure that menu
          // positioning updates correctly.
          text
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
      </ul>
    );
  }
}

export default Menu;
