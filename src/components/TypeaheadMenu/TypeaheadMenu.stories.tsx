import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import TypeaheadMenu, { TypeaheadMenuProps } from './TypeaheadMenu';

import options from '../../tests/data';
import { getOptionProperty } from '../../utils';

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

const Template: StoryFn<TypeaheadMenuProps> = (args) => (
  <div style={{ minHeight: '300px' }}>
    <div style={{ position: 'relative' }}>
      <TypeaheadMenu {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const CustomOption = Template.bind({});
CustomOption.args = {
  ...defaultProps,
  options: [{ customOption: true, name: 'custom option' }],
  text: 'custom option',
};

export const Pagination = Template.bind({});
Pagination.args = {
  ...defaultProps,
  options: [...options.slice(0, 5), { name: '', paginationOption: true }],
};

export const CustomChildren = Template.bind({});
CustomChildren.args = {
  ...defaultProps,
  renderMenuItemChildren: (option) => {
    const name = getOptionProperty(option, 'name');
    const population = getOptionProperty(option, 'population');

    return (
      <>
        <div>{name}</div>
        <div>
          <small>Population: {population.toString()}</small>
        </div>
      </>
    );
  },
};
