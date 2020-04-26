// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import Highlighter from './Highlighter.react';
import Menu from './Menu.react';
import MenuItem from './MenuItem.react';

import {
  getGroupByFunction,
  getOptionLabel,
  getOptionProperty,
} from '../utils';

import type { MenuComponentProps } from './Menu.react';
import type { LabelKey, GroupBy, GroupByFunction, Option } from '../types';

export type TypeaheadMenuProps = MenuComponentProps & {
  labelKey: LabelKey,
  groupBy: GroupBy,
  newSelectionPrefix: React.Node,
  options: Option[],
  paginationText: React.Node,
  renderMenuItemChildren: (Option, TypeaheadMenuProps, number) => React.Node,
};

const propTypes = {
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix: PropTypes.node,
  /**
   * Prompt displayed when large data sets are paginated.
   */
  paginationText: PropTypes.node,
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
    idx: number,
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
      groupBy,
      newSelectionPrefix,
      options,
      renderMenuItemChildren,
      text,
      ...menuProps
    } = this.props;

    const groupByFn = getGroupByFunction(groupBy);

    if (groupByFn) {
      return this._renderGrouped(groupByFn, menuProps);
    }

    return (
      // Explictly pass some props so Flow doesn't complain...
      <Menu {...menuProps} id={id} text={text}>
        {options.map(this._renderMenuItem)}
      </Menu>
    );
  }

  _renderGrouped = (
    groupByFn: GroupByFunction,
    menuProps: MenuComponentProps,
  ) => {
    const { options, id, text } = this.props;
    let i = 0;

    const grouped = groupByFn(options);
    const items = Object.keys(grouped).map((group, index) => (
      <React.Fragment key={group}>
        {index !== 0 && <Menu.Divider />}
        <Menu.Header>{group}</Menu.Header>
        {grouped[group].map((option) => this._renderMenuItem(option, i++))}
      </React.Fragment>
    ));

    return (
      <Menu {...menuProps} id={id} text={text}>
        {items}
      </Menu>
    );
  };

  _renderMenuItem = (option: Option, position: number) => {
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
      label,
      option,
      position,
    };

    if (option.customOption) {
      return (
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-custom-option"
          key={position}
          label={newSelectionPrefix + label}
        >
          {newSelectionPrefix}
          <Highlighter search={text}>{label}</Highlighter>
        </MenuItem>
      );
    }

    if (option.paginationOption) {
      return (
        <React.Fragment key="pagination-item">
          <Menu.Divider />
          <MenuItem
            {...menuItemProps}
            className="rbt-menu-pagination-option"
            label={paginationText}
          >
            {paginationText}
          </MenuItem>
        </React.Fragment>
      );
    }

    return (
      <MenuItem {...menuItemProps} key={position}>
        {renderMenuItemChildren(option, this.props, position)}
      </MenuItem>
    );
  };
}

export default TypeaheadMenu;
