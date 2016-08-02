import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import MenuItem from '../src/MenuItem.react';
import TypeaheadMenu from '../src/TypeaheadMenu.react';

import states from '../example/exampleData';

function getMenuInstance(props={}) {
  return ReactTestUtils.renderIntoDocument(
    <TypeaheadMenu
      labelKey=""
      options={states}
      text=""
      {...props}
    />
  );
}

function renderMenuNode(props={}) {
  const instance = getMenuInstance(props);
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'bootstrap-typeahead-menu'
  );
}

describe('<TypeaheadMenu>', () => {

  it('renders a basic typeahead menu', () => {
    const menuNode = renderMenuNode();
    expect(menuNode).to.exist;
  });

  it('renders a right-aligned typeahead menu', () => {
    const menuNode = renderMenuNode({align: 'right'});
    expect(menuNode.className).to.contain('dropdown-menu-right');
  });

  it('renders a menu with a max-height of 200px', () => {
    const menuNode = renderMenuNode({maxHeight: 200});
    expect(menuNode.style.maxHeight).to.equal('200px');
  });

  it('renders an empty state when there are no options', () => {
    const instance = getMenuInstance({options: []});
    const menuItems = ReactTestUtils.scryRenderedComponentsWithType(
      instance,
      MenuItem
    );

    expect(menuItems.length).to.equal(1);
    expect(menuItems[0].props.children).to.equal('No matches found.');
  });

});
