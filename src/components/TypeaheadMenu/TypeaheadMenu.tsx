import React, { ReactNode } from 'react';

import Highlighter from '../Highlighter';
import Menu, { MenuProps } from '../Menu';
import MenuItem from '../MenuItem';

import { getOptionLabel, getOptionProperty, isString } from '../../utils';
import { LabelKey, Option } from '../../types';

export type RenderMenuItemChildren = (
  option: Option,
  menuProps: TypeaheadMenuProps,
  idx: number
) => JSX.Element;

export interface TypeaheadMenuProps extends MenuProps {
  labelKey: LabelKey;
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix?: ReactNode;
  options: Option[];
  /**
   * Prompt displayed when large data sets are paginated.
   */
  paginationText?: ReactNode;
  /**
   * Provides a hook for customized rendering of menu item contents.
   */
  renderMenuItemChildren?: RenderMenuItemChildren;
  text: string;
}

function defaultRenderMenuItemChildren(
  option: Option,
  props: TypeaheadMenuProps
) {
  return (
    <Highlighter search={props.text}>
      {getOptionLabel(option, props.labelKey)}
    </Highlighter>
  );
}

const TypeaheadMenu = (props: TypeaheadMenuProps) => {
  const {
    labelKey,
    newSelectionPrefix = 'New selection: ',
    options,
    paginationText = 'Display additional results...',
    renderMenuItemChildren = defaultRenderMenuItemChildren,
    text,
    ...menuProps
  } = props;

  const renderMenuItem = (option: Option, position: number) => {
    const label = getOptionLabel(option, labelKey);

    const menuItemProps = {
      disabled: !!getOptionProperty(option, 'disabled'),
      label,
      option,
      position,
    };

    if (getOptionProperty(option, 'customOption')) {
      return (
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-custom-option"
          key={position}
          label={label}>
          {newSelectionPrefix}
          <Highlighter search={text}>{label}</Highlighter>
        </MenuItem>
      );
    }

    if (getOptionProperty(option, 'paginationOption')) {
      return (
        <React.Fragment key="pagination-option-divider">
          <Menu.Divider />
          <MenuItem
            {...menuItemProps}
            className="rbt-menu-pagination-option"
            label={
              // TODO: Fix how (aria-)labels are passed to `MenuItem`.
              // `paginationText` can be a ReactNode.
              isString(paginationText) ? paginationText : ''
            }>
            {paginationText}
          </MenuItem>
        </React.Fragment>
      );
    }

    return (
      <MenuItem {...menuItemProps} key={position}>
        {renderMenuItemChildren(option, props, position)}
      </MenuItem>
    );
  };

  return (
    <Menu
      {...menuProps}
      key={
        // Force a re-render if the text changes to ensure that menu
        // positioning updates correctly.
        text
      }>
      {options.map(renderMenuItem)}
    </Menu>
  );
};

export default TypeaheadMenu;
