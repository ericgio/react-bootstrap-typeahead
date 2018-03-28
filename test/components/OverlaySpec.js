import {expect} from 'chai';
import {mount, shallow} from 'enzyme';
import {noop} from 'lodash';
import React from 'react';
import {Popper} from 'react-popper';
import sinon from 'sinon';

import Menu from '../../src/Menu.react';
import Overlay from '../../src/Overlay.react';

describe('<Overlay>', () => {
  describe('shallow behaviors', () => {
    let wrapper;
    beforeEach(() => {
      const div = document.createElement('div');
      wrapper = shallow(
        <Overlay
          container={div}
          onMenuHide={noop}
          onMenuShow={noop}
          show={false}
          target={div}>
          <div>This is the menu</div>
        </Overlay>
      );
    });

    it('returns `null` when `show=false`', () => {
      expect(wrapper.length).to.equal(1);
      expect(wrapper.type()).to.equal(null);
    });

    it('renders a Popper when `show=true`', () => {
      wrapper.setProps({show: true});
      const child = wrapper.children();

      expect(child.type()).to.equal(Popper);
      expect(child.dive().text()).to.equal('This is the menu');
    });

    it('returns `null` when child is `null`', () => {
      wrapper.setProps({children: null, show: true});
      expect(wrapper.length).to.equal(1);
      expect(wrapper.type()).to.equal(null);
    });

    it('throws when multiple children are passed', () => {
      const willThrow = () => {
        wrapper.setProps({
          children: [<div key="1" />, <div key="2" />],
          show: true,
        });
      };

      expect(willThrow).to.throw(Error);
    });

    it('calls `onMenuShow` and `onMenuHide`', () => {
      const onMenuHide = sinon.spy();
      const onMenuShow = sinon.spy();

      wrapper.setProps({onMenuHide, onMenuShow});

      expect(onMenuHide.notCalled).to.equal(true);
      expect(onMenuShow.notCalled).to.equal(true);

      wrapper.setProps({show: true});
      expect(onMenuShow.calledOnce).to.equal(true);

      wrapper.setProps({show: false});
      expect(onMenuHide.calledOnce).to.equal(true);
    });
  });

  describe('mounted behaviors', () => {
    let BASE_NODE_COUNT, div, wrapper;

    beforeEach(() => {
      // Karma adds a bunch of extra nodes to the body.
      BASE_NODE_COUNT = document.body.childNodes.length;

      div = document.createElement('div');
      document.body.appendChild(div);

      wrapper = mount(
        <Overlay
          container={div}
          onMenuHide={noop}
          onMenuShow={noop}
          show={true}
          target={div}>
          <Menu id="menu-id">
            This is the menu
          </Menu>
        </Overlay>,
        {attachTo: div}
      );
    });

    afterEach(() => {
      wrapper.detach();
    });

    it('is attached to `div`', () => {
      expect(document.body.childNodes.length).to.equal(BASE_NODE_COUNT + 1);
      expect(div.childNodes.length).to.equal(1);
    });

    it('is attached to `document.body`', () => {
      wrapper.setProps({container: document.body});

      expect(document.body.childNodes.length).to.equal(BASE_NODE_COUNT + 2);
      expect(div.childNodes.length).to.equal(0);
    });
  });
});
