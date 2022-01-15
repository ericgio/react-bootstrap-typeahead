/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { Story, Meta } from '@storybook/react';

import Input, { InputProps } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {};
