import React from 'react';
import PropTypes from 'prop-types';

import Highlighter from './Highlighter.react';
import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

import {getOptionLabel} from './utils/';

class TypeaheadMenu extends React.Component {
  render() {
    const {
      labelKey,
      newSelectionPrefix,
      options,
      renderMenuItemChildren,
      text,
      ...menuProps
    } = this.props;

    return (
      <Menu {...menuProps}>
        {options.map(this._renderMenuItem)}
      </Menu>
    );
  }

  _renderMenuItem = (option, idx) => {
    const {
      labelKey,
      multiple,
      newSelectionPrefix,
      renderMenuItemChildren,
      text,
    } = this.props;

    const label = getOptionLabel(option, labelKey);

    const menuItemProps = {
      disabled: option.disabled,
      key: idx,
      label,
      multiple,
      option,
      position: idx,
    };

    if (option.customOption) {
      return (
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-custom-option"
          label={newSelectionPrefix + label}>
          {newSelectionPrefix}
          <Highlighter search={text}>
            {label}
          </Highlighter>
        </MenuItem>
      );
    }

    if (option.paginationOption) {
      return [
        <Menu.Divider key="pagination-item-divider" />,
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-pagination-option"
          key="pagination-item">
          {label}
        </MenuItem>,
      ];
    }

    return (
      <MenuItem {...menuItemProps}>
        {renderMenuItemChildren(option, this.props, idx)}
      </MenuItem>
    );
  }
}

TypeaheadMenu.propTypes = {
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix: PropTypes.string,
  /**
   * Provides a hook for customized rendering of menu item contents.
   */
  renderMenuItemChildren: PropTypes.func,
};

TypeaheadMenu.defaultProps = {
  newSelectionPrefix: 'New selection: ',
  renderMenuItemChildren: (option, props, idx) => (
    <Highlighter search={props.text}>
      {getOptionLabel(option, props.labelKey)}
    </Highlighter>
  ),
};


export default TypeaheadMenu;
