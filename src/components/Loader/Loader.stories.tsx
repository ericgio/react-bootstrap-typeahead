import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Loader, { LoaderProps } from './Loader';

export default {
  title: 'Components/Loader',
  component: Loader,
} as Meta;

const Template: StoryFn<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {};
