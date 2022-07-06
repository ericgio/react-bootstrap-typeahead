/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { Story, Meta } from '@storybook/react';

import { BaseMenuItem, BaseMenuItemProps } from './MenuItem';

export default {
  title: 'Components/MenuItem/BaseMenuItem',
  component: BaseMenuItem,
} as Meta;

const Template: Story<BaseMenuItemProps> = (args) => <BaseMenuItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a base menu item',
};

export const Active = Template.bind({});
Active.args = {
  active: true,
  children: 'This is an active base menu item',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'This is a disabled base menu item',
  disabled: true,
};
