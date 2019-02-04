import {expect} from 'chai';
import {mount, shallow} from 'enzyme';
import React from 'react';
import {Popper} from 'react-popper';
import sinon from 'sinon';

import Menu from '../../src/Menu.react';
import Overlay from '../../src/base/Overlay';

describe('<Overlay>', () => {
  describe('shallow behaviors', () => {
    let wrapper;
    beforeEach(() => {
      const div = document.createElement('div');
      wrapper = shallow(
        <Overlay
          container={div}
          referenceElement={div}
          show={false}>
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
      expect(wrapper.children().type()).to.equal(Popper);
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

    describe('menu visibility hooks', () => {
      it('calls `onMenuShow`', () => {
        const onMenuShow = sinon.spy();

        wrapper.setProps({onMenuShow});

        expect(onMenuShow.notCalled).to.equal(true);

        wrapper.setProps({show: true});
        expect(onMenuShow.calledOnce).to.equal(true);

        // Shouldn't be called again if not hidden first.
        wrapper.setProps({show: true});
        expect(onMenuShow.calledOnce).to.equal(true);
      });

      it('calls `onMenuHide`', () => {
        const onMenuHide = sinon.spy();

        wrapper.setProps({
          onMenuHide,
          show: true,
        });

        expect(onMenuHide.notCalled).to.equal(true);

        wrapper.setProps({show: false});
        expect(onMenuHide.calledOnce).to.equal(true);

        // Shouldn't be called again if not shown first.
        wrapper.setProps({show: false});
        expect(onMenuHide.calledOnce).to.equal(true);
      });

      it('calls `onMenuToggle`', () => {
        const onMenuToggle = sinon.spy();

        wrapper.setProps({onMenuToggle});

        expect(onMenuToggle.notCalled).to.equal(true);

        wrapper.setProps({show: true});
        expect(onMenuToggle.callCount).to.equal(1);

        // Shouldn't be called again if not hidden first.
        wrapper.setProps({show: true});
        expect(onMenuToggle.callCount).to.equal(1);

        wrapper.setProps({show: false});
        expect(onMenuToggle.callCount).to.equal(2);
      });
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
          referenceElement={div}
          show>
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

    it('renders a Popper when `show=true`', () => {
      expect(wrapper.find('.rbt-menu').text()).to.equal('This is the menu');
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
