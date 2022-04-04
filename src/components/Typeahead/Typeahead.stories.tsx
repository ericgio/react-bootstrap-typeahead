/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import cx from 'classnames';
import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import Typeahead, { TypeaheadComponentProps } from './Typeahead';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

import options from '../../tests/data';
import { noop } from '../../tests/helpers';

export default {
  title: 'Components/Typeahead',
  component: Typeahead,
  argTypes: {
    align: {
      options: ['justify', 'left', 'right'],
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    size: {
      options: ['default', 'sm', 'lg'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
    },
  },
} as Meta;

const defaultProps = {
  allowNew: false,
  clearButton: false,
  flip: true,
  id: 'rbt-id',
  isLoading: false,
  labelKey: 'name',
  multiple: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  onInputChange: noop,
  onKeyDown: noop,
  options,
  placeholder: 'Choose a state...',
  positionFixed: true,
};

const Template: Story<TypeaheadComponentProps> = (args) => (
  <Typeahead {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  ...defaultProps,
  defaultSelected: options.slice(0, 4),
  multiple: true,
};

export const ClearButton = Template.bind({});
ClearButton.args = {
  ...defaultProps,
  clearButton: true,
  defaultSelected: options.slice(0, 1),
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  ...defaultProps,
  isLoading: true,
};

export const Pagination = Template.bind({});
Pagination.args = {
  ...defaultProps,
  maxResults: 10,
  paginate: true,
};

export const AllowNew = Template.bind({});
AllowNew.args = {
  ...defaultProps,
  allowNew: true,
};

export const CustomMenu = Template.bind({});
CustomMenu.args = {
  ...defaultProps,
  renderMenu: (results, menuProps) => (
    <Menu {...menuProps} inputHeight={0} scheduleUpdate={noop}>
      {/* Use `slice` to avoid mutating the original array */}
      {results
        .slice()
        .reverse()
        .map((r, index) => (
          // @ts-ignore
          <MenuItem key={r.name} option={r} position={index}>
            {
              // @ts-ignore
              r.name
            }
          </MenuItem>
        ))}
    </Menu>
  ),
};

export const InputGrouping = (args: TypeaheadComponentProps) => (
  <div
    className={cx('input-group', {
      'input-group-sm': args.size === 'sm',
      'input-group-lg': args.size === 'lg',
    })}>
    <span className="input-group-text">$</span>
    <Typeahead {...args} />
    <span className="input-group-text">.00</span>
  </div>
);
InputGrouping.args = {
  ...defaultProps,
};

export const Controlled = (args: TypeaheadComponentProps) => {
  const [selected, setSelected] = useState(args.selected || []);

  return <Typeahead {...args} onChange={setSelected} selected={selected} />;
};
Controlled.args = {
  ...defaultProps,
};
