/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Menu, { MenuProps } from './Menu';
import MenuItem from '../MenuItem';

const options = [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }];

// TODO: Caused by `isRequiredForA11y` validator.
// @ts-ignore
export default {
  title: 'Components/Menu',
  component: Menu,
} as Meta;

const children = options.map((o, idx) => (
  <MenuItem key={o.label} option={o} position={idx}>
    {o.label}
  </MenuItem>
));

const Template: StoryFn<MenuProps> = (args) => (
  <Menu
    {...args}
    style={{
      ...args.style,
      position: 'relative',
    }}
  />
);

export const Default = Template.bind({});
Default.args = {
  children,
  id: 'default-menu',
};

export const Empty = Template.bind({});
Empty.args = {
  id: 'empty-menu',
};

export const HeaderAndDivider = Template.bind({});
HeaderAndDivider.args = {
  children: (
    <>
      <Menu.Header>This is a menu header</Menu.Header>
      <Menu.Divider />
      <MenuItem option={options[0]} position={0}>
        {options[0].label}
      </MenuItem>
    </>
  ),
  id: 'header-and-divider',
};
