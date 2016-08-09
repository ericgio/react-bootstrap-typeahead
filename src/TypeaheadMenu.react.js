'use strict';

import cx from 'classnames';
import Highlight from 'react-highlighter';
import React, {PropTypes} from 'react';

import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

const TypeaheadMenu = React.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    activeIndex: PropTypes.number,
    align: PropTypes.oneOf(['justify', 'left', 'right']),
    className: PropTypes.string,
    emptyLabel: PropTypes.string,
    initialResultCount: PropTypes.number,
    labelKey: PropTypes.string.isRequired,
    maxHeight: PropTypes.number,
    newSelectionPrefix: PropTypes.string,
    options: PropTypes.array,
    paginationText: PropTypes.string,
    renderMenuItemChildren: PropTypes.func,
    text: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      initialResultCount: 100,
      maxHeight: 300,
      newSelectionPrefix: 'New selection: ',
      paginationText: 'Display additional results...',
    };
  },

  getInitialState() {
    return {
      /**
       * Max number of results to display, for performance reasons. If this
       * number is less than the number of available results, the user will see
       * an option to display more results.
       */
      resultCount: this.props.initialResultCount,
    };
  },

  render() {
    const {align, emptyLabel, maxHeight, options} = this.props;

    // Render the max number of results or all results.
    const results = options.slice(0, this.state.resultCount || options.length);
    const menuItems = results.length ?
      results.map(this._renderMenuItem) :
      <MenuItem disabled>
        {emptyLabel}
      </MenuItem>;

    return (
      <Menu
        className={cx('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right',
        }, this.props.className)}
        style={{
          maxHeight: maxHeight + 'px',
          overflow: 'auto',
        }}>
        {menuItems}
        {this._renderPaginationMenuItem(results)}
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
          {option[labelKey]}
        </Highlight>
      </MenuItem>;
  },

  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem(results) {
    const {options, paginationText} = this.props;

    if (results.length < options.length) {
      return [
        <li
          className="divider"
          key="pagination-item-divider"
          role="separator"
        />,
        <MenuItem
          className="bootstrap-typeahead-menu-paginator"
          key="pagination-item"
          onClick={this._handlePagination}>
          {paginationText}
        </MenuItem>,
      ];
    }
  },

  _handlePagination(e) {
    let resultCount = this.state.resultCount + this.props.initialResultCount;
    this.setState({resultCount});
  },
});

export default TypeaheadMenu;
