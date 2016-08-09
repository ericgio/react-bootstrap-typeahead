'use strict';

import cx from 'classnames';
import React, {Children, PropTypes} from 'react';

import MenuItem from './MenuItem.react';

const BaseMenu = props => (
  <ul
    {...props}
    className={cx('dropdown-menu', props.className)}>
    {props.children}
  </ul>
);

/**
 * Menu component that automatically handles pagination and empty state when
 * passed a set of filtered and truncated results.
 */
const Menu = React.createClass({
  displayName: 'Menu',

  propTypes: {
    /**
     * Specify menu alignment. The default value is `justify`, which makes the
     * menu as wide as the input and truncates long values. Specifying `left`
     * or `right` will align the menu to that side and the width will be
     * determined by the length of menu item values.
     */
    align: PropTypes.oneOf(['justify', 'left', 'right']),
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: PropTypes.number,
    /**
     * Prompt displayed when large data sets are paginated.
     */
    paginationText: PropTypes.string,
  },

  getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      maxHeight: 300,
      paginate: true,
      paginationText: 'Display additional results...',
    };
  },

  render() {
    const {align, children, className, emptyLabel, maxHeight} = this.props;
    const contents = Children.count(children) === 0 ?
      <MenuItem disabled>
        {emptyLabel}
      </MenuItem> :
      children;

    return (
      <BaseMenu
        className={cx('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right',
        }, className)}
        style={{
          maxHeight: maxHeight + 'px',
          overflow: 'auto',
        }}>
        {contents}
        {this._renderPaginationMenuItem()}
      </BaseMenu>
    );
  },

  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem() {
    const {children, onPaginate, paginate, paginationText} = this.props;

    if (paginate && Children.count(children)) {
      return [
        <li
          className="divider"
          key="pagination-item-divider"
          role="separator"
        />,
        <MenuItem
          className="bootstrap-typeahead-menu-paginator"
          key="pagination-item"
          onClick={onPaginate}>
          {paginationText}
        </MenuItem>,
      ];
    }
  },
});

export default Menu;
