import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import Input, { InputProps } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {};
