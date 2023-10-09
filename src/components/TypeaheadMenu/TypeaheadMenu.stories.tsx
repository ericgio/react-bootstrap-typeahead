/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React from 'react';
import { Story, Meta } from '@storybook/react';

import TypeaheadMenu, { TypeaheadMenuProps } from './TypeaheadMenu';

import options, {TestOption} from '../../tests/data';
import {OptionType} from "../../types";

export default {
  title: 'Components/TypeaheadMenu',
  component: TypeaheadMenu,
} as Meta;

const defaultProps = {
  id: 'typeahead-menu',
  labelKey: 'name',
  options,
  text: '',
};

const Template = <Option extends OptionType>(): Story<TypeaheadMenuProps<Option>> => (args) => (
  <div style={{ minHeight: '300px' }}>
    <div style={{ position: 'relative' }}>
      <TypeaheadMenu {...args} />
    </div>
  </div>
);

export const Default = Template().bind({});
Default.args = {
  ...defaultProps,
};

export const CustomOption = Template().bind({});
CustomOption.args = {
  ...defaultProps,
  options: [{ customOption: true, name: 'custom option' }],
  text: 'custom option',
};

export const Pagination = Template().bind({});
Pagination.args = {
  ...defaultProps,
  options: [...options.slice(0, 5), { paginationOption: true }],
};

export const CustomChildren = Template<TestOption>().bind({});
CustomChildren.args = {
  ...defaultProps,
  renderMenuItemChildren: (option) => {
    return (
      <>
        <div>{option.name}</div>
        <div>
          <small>Population: {option.population.toString()}</small>
        </div>
      </>
    );
  },
};
