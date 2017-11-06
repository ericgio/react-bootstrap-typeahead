import {expect} from 'chai';
import * as React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import MenuItem, {BaseMenuItem} from '../src/MenuItem';
import TypeaheadContext from './utils/TypeaheadContext';

function getBaseMenuItemNode(props={}) {
  const instance = ReactTestUtils.renderIntoDocument(
    <BaseMenuItem {...props}>
      This is a base menu item.
    </BaseMenuItem>
  );
  return ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'LI');
}

function getMenuItemNode(props={}, contextProps={}) {
  const instance = ReactTestUtils.renderIntoDocument(
    <TypeaheadContext {...contextProps}>
      <MenuItem {...props} option={{label: 'test'}} position={0}>
        This is a menu item.
      </MenuItem>
    </TypeaheadContext>
  );
  return ReactTestUtils.findRenderedDOMComponentWithTag(instance, 'LI');
}

describe('MenuItemSpec', () => {
  let clickValue;

  function onClick() {
    clickValue = 'clicked';
  }

  beforeEach(() => {
    clickValue = undefined;
  });

  describe('<BaseMenuItem>', () => {
    it('renders a base menu item', () => {
      const menuItemNode = getBaseMenuItemNode();
      expect(menuItemNode).to.exist;
    });

    it('renders an active base menu item', () => {
      const menuItemNode = getBaseMenuItemNode({active: true});
      expect(menuItemNode.className).to.contain('active');
    });

    it('triggers an event when clicked', () => {
      const menuItemNode = getBaseMenuItemNode({onClick});
      ReactTestUtils.Simulate.click(menuItemNode.childNodes[0]);

      expect(clickValue).to.equal('clicked');
    });

    it('renders a disabled base menu item', () => {
      const menuItemNode = getBaseMenuItemNode({disabled: true});
      expect(menuItemNode.className).to.contain('disabled');

      // Disabled items don't allow `onClick` events.
      ReactTestUtils.Simulate.click(menuItemNode.childNodes[0]);
      expect(clickValue).to.equal(undefined);
    });

  });

  describe('<MenuItem>', () => {

    it('renders a menu item', () => {
      const menuItemNode = getMenuItemNode();
      expect(menuItemNode).to.exist;
    });

    it('changes the active state of the menu item', () => {
      const inactiveNode = getMenuItemNode();
      expect(inactiveNode.className).to.not.contain('active');

      const activeNode = getMenuItemNode({}, {activeIndex: 0});
      expect(activeNode.className).to.contain('active');
    });

    it('sets the active state if it is the only result', () => {
      const activeNode = getMenuItemNode({}, {isOnlyResult: true});
      expect(activeNode.className).to.contain('active');
    });

    it('triggers an event when clicked', () => {
      const menuItemNode = getMenuItemNode({onClick});
      ReactTestUtils.Simulate.click(menuItemNode.childNodes[0]);

      expect(clickValue).to.equal('clicked');
    });

  });

});
