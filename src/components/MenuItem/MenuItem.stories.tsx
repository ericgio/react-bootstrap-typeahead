/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { Story, Meta } from '@storybook/react';

import MenuItem, { MenuItemProps } from './MenuItem';
import {
  createTypeaheadContext,
  defaultContext,
  TypeaheadContextType,
} from '../../core/Context';
import {OptionType} from "../../types";

export default {
  title: 'Components/MenuItem/MenuItem',
  component: MenuItem,
} as Meta;

interface Args<Option extends OptionType> {
  context: Partial<TypeaheadContextType<Option>>;
  props: MenuItemProps<Option>;
}

const value = {
  ...defaultContext,
  id: 'test-id',
};

const Template = <Option extends OptionType>(): Story<Args<Option>> => ({ context, props }) => {
  const TypeaheadContext = createTypeaheadContext<Option>()
  return <TypeaheadContext.Provider value={{...value, ...context}}>
    <MenuItem {...props} />
  </TypeaheadContext.Provider>
};

export const Default = Template().bind({});
Default.args = {
  props: {
    children: 'This is a menu item',
    label: 'test label',
    option: '',
    position: 0,
  },
};
