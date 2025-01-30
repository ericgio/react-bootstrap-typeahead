import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import MenuItem, { MenuItemProps } from './MenuItem';
import {
  defaultContext,
  TypeaheadContext,
  TypeaheadContextType,
} from '../../core/Context';

export default {
  title: 'Components/MenuItem/MenuItem',
  component: MenuItem,
} as Meta;

interface Args {
  context: Partial<TypeaheadContextType>;
  props: MenuItemProps;
}

const value = {
  ...defaultContext,
  id: 'test-id',
};

const Template: StoryFn<Args> = ({ context, props }) => (
  <TypeaheadContext.Provider value={{ ...value, ...context }}>
    <div className="dropdown-menu show">
      <MenuItem {...props} />
    </div>
  </TypeaheadContext.Provider>
);

export const Default = Template.bind({});
Default.args = {
  props: {
    children: 'This is a menu item',
    label: 'test label',
    option: '',
    position: 0,
  },
};
