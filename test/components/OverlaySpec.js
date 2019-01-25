import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import {Popper} from 'react-popper';
import sinon from 'sinon';

import Menu from '../../src/Menu.react';
import Overlay from '../../src/core/Overlay';

function getPopper(wrapper) {
  return wrapper.find(Popper);
}

function isPositionFixed(wrapper) {
  return getPopper(wrapper).prop('positionFixed');
}

describe('<Overlay>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Overlay
        referenceElement={document.createElement('div')}
        show={false}>
        {(props) => <Menu {...props} id="menu-id">This is the menu</Menu>}
      </Overlay>
    );
  });

  it('does not render children when `show=false`', () => {
    expect(wrapper.length).to.equal(1);
    expect(getPopper(wrapper).length).to.equal(0);
  });

  it('renders children `show=true`', () => {
    wrapper.setProps({show: true});
    expect(getPopper(wrapper).length).to.equal(1);
  });

  it('updates the positioning type', () => {
    wrapper.setProps({show: true});

    // Uses absolute positioning by default.
    expect(isPositionFixed(wrapper)).to.equal(false);

    wrapper.setProps({positionFixed: true});
    expect(isPositionFixed(wrapper)).to.equal(true);
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
