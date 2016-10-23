'use strict';

import {pick} from 'lodash';
import Highlight from 'react-highlighter';
import React, {PropTypes} from 'react';

import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

import getOptionLabel from './utils/getOptionLabel';

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
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: PropTypes.func,
  },

  getDefaultProps() {
    return {
      newSelectionPrefix: 'New selection: ',
    };
  },

  render() {
    const menuProps = pick(this.props, [
      'align',
      'emptyLabel',
      'maxHeight',
      'onPaginate',
      'paginate',
      'paginationText',
    ]);

    return (
      <Menu {...menuProps}>
        {this.props.options.map(this._renderMenuItem)}
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
      disabled: option.disabled,
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
});

export default TypeaheadMenu;
