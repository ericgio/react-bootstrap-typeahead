import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import Loader, { LoaderProps } from './Loader';

export default {
  title: 'Components/Loader',
  component: Loader,
} as Meta;

const Template: StoryFn<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {};
