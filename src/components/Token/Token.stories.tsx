import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import Token, { TokenProps } from './Token';
import { noop } from '../../utils';

export default {
  title: 'Components/Token',
  component: Token,
} as Meta;

const Template: StoryFn<TokenProps<HTMLElement>> = (args) => (
  <Token {...args} />
);

export const Interactive = Template.bind({});
Interactive.args = {
  children: 'This is an interactive token',
  onRemove: noop,
};

export const Static = Template.bind({});
Static.args = {
  children: 'This is a static token',
  readOnly: true,
};

export const Anchor = Template.bind({});
Anchor.args = {
  children: 'This is a link token',
  href: '#',
  readOnly: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'This is a disabled token',
  disabled: true,
};
