'use strict';

import cx from 'classnames';
import Highlight from 'react-highlighter';
import React, {PropTypes} from 'react';

import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

import getOptionLabel from './getOptionLabel';

const TypeaheadMenu = React.createClass({
  displayName: 'TypeaheadMenu',

  /**
   * In addition to the propTypes below, the following props are automatically
   * passed down by `Typeahead.react`:
   *
   *  - activeIndex
   *  - labelKey
   *  - onClick
   *  - onPaginate
   *  - options
   *  - paginate
   *  - text
   */
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
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: PropTypes.string,
    /**
     * Prompt displayed when large data sets are paginated.
     */
    paginationText: PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: PropTypes.func,
  },

  getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      maxHeight: 300,
      newSelectionPrefix: 'New selection: ',
      paginate: true,
      paginationText: 'Display additional results...',
    };
  },

  render() {
    const {align, emptyLabel, maxHeight, options} = this.props;

    const menuItems = options.length ?
      options.map(this._renderMenuItem) :
      <MenuItem disabled>
        {emptyLabel}
      </MenuItem>;

    return (
      <Menu
        className={cx('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right',
        })}
        style={{
          maxHeight: maxHeight + 'px',
          overflow: 'auto',
        }}>
        {menuItems}
        {this._renderPaginationMenuItem(options)}
      </Menu>
    );
  },

  _renderMenuItem(option, idx) {
    const {
      activeIndex,
      labelKey,
      newSelectionPrefix,
      onClick,
      renderMenuItemChildren,
      text,
    } = this.props;

    let menuItemProps = {
      active: idx === activeIndex,
      key: idx,
      onClick: () => onClick(option),
    };

    if (option.customOption) {
      return (
        <MenuItem {...menuItemProps}>
          {newSelectionPrefix}
          <Highlight search={text}>
            {option[labelKey]}
          </Highlight>
        </MenuItem>
      );
    }

    return renderMenuItemChildren ?
      <MenuItem {...menuItemProps}>
        {renderMenuItemChildren(this.props, option, idx)}
      </MenuItem> :
      <MenuItem {...menuItemProps}>
        <Highlight search={text}>
          {getOptionLabel(option, labelKey)}
        </Highlight>
      </MenuItem>;
  },

  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem(options) {
    const {onPaginate, paginate, paginationText} = this.props;

    if (paginate && options.length) {
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

export default TypeaheadMenu;
