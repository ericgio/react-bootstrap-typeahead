// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import Highlighter from './Highlighter.react';
import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

import { getOptionLabel, getOptionProperty } from '../utils';

import type { MenuComponentProps } from './Menu.react';
import type { LabelKey, Option } from '../types';

export type TypeaheadMenuProps = MenuComponentProps & {
  labelKey: LabelKey,
  newSelectionPrefix: string,
  options: Option[],
  paginationText: string,
  renderMenuItemChildren: (Option, TypeaheadMenuProps, number) => React.Node,
};

const propTypes = {
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
};

const defaultProps = {
  newSelectionPrefix: 'New selection: ',
  paginationText: 'Display additional results...',
  renderMenuItemChildren: (
    option: Option,
    props: TypeaheadMenuProps,
    idx: number
  ) => (
    <Highlighter search={props.text}>
      {getOptionLabel(option, props.labelKey)}
    </Highlighter>
  ),
};

class TypeaheadMenu extends React.Component<TypeaheadMenuProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  render() {
    const {
      id,
      labelKey,
      newSelectionPrefix,
      options,
      renderMenuItemChildren,
      text,
      ...menuProps
    } = this.props;

    return (
      // Explictly pass some props so Flow doesn't complain...
      <Menu {...menuProps} id={id} text={text}>
        {options.map(this._renderMenuItem)}
      </Menu>
    );
  }

  _renderMenuItem = (option: Option, idx: number) => {
    const {
      labelKey,
      newSelectionPrefix,
      paginationText,
      renderMenuItemChildren,
      text,
    } = this.props;

    const label = getOptionLabel(option, labelKey);

    const menuItemProps = {
      disabled: getOptionProperty(option, 'disabled'),
      key: idx,
      label,
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
          key="pagination-item"
          label={paginationText}>
          {paginationText}
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

export default TypeaheadMenu;
