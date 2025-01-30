/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Highlighter, { HighlighterProps } from './Highlighter';

export default {
  title: 'Components/Highlighter',
  component: Highlighter,
} as Meta;

const Template: StoryFn<HighlighterProps> = (args) => <Highlighter {...args} />;

const children = 'This is a sentence.';

export const Default = Template.bind({});
Default.args = {
  children,
  search: '',
};

export const Highlighted = Template.bind({});
Highlighted.args = {
  children,
  search: 'sent',
};
