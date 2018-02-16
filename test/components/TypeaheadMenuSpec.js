import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import MenuItem, {BaseMenuItem} from '../../src/MenuItem';
import TypeaheadMenu from '../../src/TypeaheadMenu';

import options from '../../example/exampleData';
import {bigDataSet, childContextTypes, context, getPaginator} from '../helpers';

describe('<TypeaheadMenu>', () => {
  let menu;

  beforeEach(() => {
    menu = mount(
      <TypeaheadMenu
        labelKey="name"
        options={options}
        text=""
      />,
      {childContextTypes, context}
    );
  });

  it('renders a basic typeahead menu', () => {
    expect(menu.find('ul').hasClass('rbt-menu')).to.equal(true);
    expect(menu.find(MenuItem).length).to.equal(options.length);
  });

  it('renders a right-aligned typeahead menu', () => {
    const menuNode = menu
      .setProps({align: 'right'})
      .find('ul');

    expect(menuNode.hasClass('dropdown-menu-right')).to.equal(true);
  });

  it('renders a menu with a max-height of 200px', () => {
    const menuNode = menu
      .setProps({maxHeight: 200})
      .find('ul');

    expect(menuNode.props().style.maxHeight).to.equal('200px');
  });

  it ('renders disabled menu items', () => {
    const menuItems = menu
      .setProps({options: options.map((o) => ({...o, disabled: true}))})
      .find(MenuItem);

    expect(menuItems.first().props().disabled).to.equal(true);
  });

  it('renders an empty state when there are no results', () => {
    const emptyLabel = 'No matches found.';

    const menuItems = menu
      .setProps({emptyLabel, options: []})
      .find(BaseMenuItem);

    expect(menuItems.length).to.equal(1);
    expect(menuItems.first().text()).to.equal(emptyLabel);
  });

  describe('pagination behaviors', () => {
    beforeEach(() => {
      menu.setProps({
        options: bigDataSet,
        paginate: true,
      });
    });

    it('displays a paginator', () => {
      const paginatorNode = getPaginator(menu);
      expect(paginatorNode.length).to.equal(1);
      expect(paginatorNode.text()).to.equal('Display additional results...');
    });

    it('does not show a paginator when there are no results', () => {
      menu.setProps({options: []});
      expect(getPaginator(menu).length).to.equal(0);
    });

    it('does not show a paginator if `paginate=false`', () => {
      menu.setProps({paginate: false});
      expect(getPaginator(menu).length).to.equal(0);
    });

    it('displays custom pagination text', () => {
      const paginationText = 'See All';

      menu.setProps({paginationText});

      expect(getPaginator(menu).text()).to.equal(paginationText);
    });
  });
});
