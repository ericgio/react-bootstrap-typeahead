/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { Meta, Story } from '@storybook/react';

import ClearButton, { ClearButtonProps } from './ClearButton';

export default {
  title: 'Components/ClearButton',
  component: ClearButton,
} as Meta;

const Template: Story<ClearButtonProps> = (args) => <ClearButton {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
};
