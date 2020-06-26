// @flow

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import type { Node } from 'react';

import Highlighter from './Highlighter';
import Menu from './Menu';
import MenuItem from './MenuItem';

import { getOptionLabel, getOptionProperty } from '../utils';

import type { MenuComponentProps } from './Menu';
import type { LabelKey, Option } from '../types';

export type TypeaheadMenuProps = MenuComponentProps & {
  labelKey: LabelKey,
  newSelectionPrefix: Node,
  options: Option[],
  paginationText: Node,
  renderMenuItemChildren: (Option, TypeaheadMenuProps, number) => Node,
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
    idx: number
  ) => (
    <Highlighter search={props.text}>
      {getOptionLabel(option, props.labelKey)}
    </Highlighter>
  ),
};

const TypeaheadMenu = (props: TypeaheadMenuProps) => {
  const {
    labelKey,
    newSelectionPrefix,
    options,
    paginationText,
    renderMenuItemChildren,
    text,
    ...menuProps
  } = props;

  const renderMenuItem = (option: Option, position: number) => {
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
          label={newSelectionPrefix + label}>
          {newSelectionPrefix}
          <Highlighter search={text}>
            {label}
          </Highlighter>
        </MenuItem>
      );
    }

    if (option.paginationOption) {
      return (
        <Fragment key="pagination-item">
          <Menu.Divider />
          <MenuItem
            {...menuItemProps}
            className="rbt-menu-pagination-option"
            label={paginationText}>
            {paginationText}
          </MenuItem>
        </Fragment>
      );
    }

    return (
      <MenuItem {...menuItemProps} key={position}>
        {renderMenuItemChildren(option, props, position)}
      </MenuItem>
    );
  };

  return (
    // Explictly pass `text` so Flow doesn't complain...
    <Menu {...menuProps} text={text}>
      {options.map(renderMenuItem)}
    </Menu>
  );
};

TypeaheadMenu.propTypes = propTypes;
TypeaheadMenu.defaultProps = defaultProps;

export default TypeaheadMenu;
