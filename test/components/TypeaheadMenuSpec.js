import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import MenuItem, { BaseMenuItem } from '../../src/MenuItem.react';
import TypeaheadMenu from '../../src/TypeaheadMenu.react';

import options from '../../example/exampleData';
import { getMenu, getPaginator } from '../helpers';

describe('<TypeaheadMenu>', () => {
  let menu;

  beforeEach(() => {
    menu = mount(
      <TypeaheadMenu
        id="menu-id"
        labelKey="name"
        options={options}
        text=""
      />
    );
  });

  it('renders a basic typeahead menu', () => {
    expect(menu.find('ul').hasClass('rbt-menu')).to.equal(true);
    expect(menu.find(MenuItem).length).to.equal(options.length);
  });

  it('renders a menu with the specified max-height', () => {
    const getMaxHeight = (wrapper) => getMenu(wrapper).prop('style').maxHeight;

    menu.setProps({ maxHeight: '200px' });
    expect(getMaxHeight(menu)).to.equal('200px');

    menu.setProps({ maxHeight: '50%' });
    expect(getMaxHeight(menu)).to.equal('50%');
  });

  it('renders disabled menu items', () => {
    menu.setProps({ options: options.map((o) => ({ ...o, disabled: true })) });
    expect(menu.find(MenuItem).first().prop('disabled')).to.equal(true);
  });

  it('renders an empty state when there are no results', () => {
    const emptyLabel = 'No matches found.';

    const menuItems = menu
      .setProps({ emptyLabel, options: [] })
      .find(BaseMenuItem);

    expect(menuItems.length).to.equal(1);
    expect(menuItems.first().text()).to.equal(emptyLabel);
  });

  describe('pagination behaviors', () => {
    let onPaginate, paginationLabel;

    beforeEach(() => {
      onPaginate = sinon.spy();
      paginationLabel = 'More results...';
      menu.setProps({
        maxResults: 10,
        onPaginate,
        options: options.concat({
          name: paginationLabel,
          paginationOption: true,
        }),
      });
    });

    it('displays a paginator', () => {
      const paginatorNode = getPaginator(menu);
      expect(paginatorNode.length).to.equal(1);
      expect(paginatorNode.text()).to.equal(paginationLabel);
    });

    it('does not show a paginator when there are no results', () => {
      menu.setProps({ options: [] });
      expect(getPaginator(menu).length).to.equal(0);
    });
  });
});
