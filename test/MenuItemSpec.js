import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import MenuItem from '../src/MenuItem.react';

let clickValue;

function onClick() {
  clickValue = 'clicked';
}

function getMenuItemNode(props={}) {
  const instance = ReactTestUtils.renderIntoDocument(
    <MenuItem {...props}>
      This is a menu item.
    </MenuItem>
  );
  return ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'LI');
}

describe('<MenuItem>', () => {

  it('renders a menu item', () => {
    const menuItemNode = getMenuItemNode();
    expect(menuItemNode).to.exist;
  });

  it('renders an active menu item', () => {
    const menuItemNode = getMenuItemNode({active: true});
    expect(menuItemNode.className).to.contain('active');
  });

  it('triggers an event when clicked', () => {
    const menuItemNode = getMenuItemNode({onClick});
    ReactTestUtils.Simulate.click(menuItemNode.childNodes[0]);

    expect(clickValue).to.equal('clicked');
  });

  it('renders a disabled menu item', () => {
    const menuItemNode = getMenuItemNode({disabled: true});
    expect(menuItemNode.className).to.contain('disabled');

    // Reset value.
    clickValue = undefined;

    // Disabled items don't allow `onClick` events.
    ReactTestUtils.Simulate.click(menuItemNode.childNodes[0]);
    expect(clickValue).to.equal(undefined);
  });

});
