import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import {BaseMenuItem} from '../src/MenuItem.react';

let clickValue;

function onClick() {
  clickValue = 'clicked';
}

function getMenuItemNode(props={}) {
  const instance = ReactTestUtils.renderIntoDocument(
    <BaseMenuItem {...props}>
      This is a menu item.
    </BaseMenuItem>
  );
  return ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'LI');
}

describe('<BaseMenuItem>', () => {

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
