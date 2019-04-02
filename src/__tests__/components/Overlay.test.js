import { mount } from 'enzyme';
import React from 'react';
import { Popper } from 'react-popper';

import Menu from '../../components/Menu.react';
import Overlay from '../../core/Overlay';

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
        isMenuShown
        referenceElement={document.createElement('div')}>
        {(props) => <Menu {...props} id="menu-id">This is the menu</Menu>}
      </Overlay>
    );
  });

  test('renders children `isMenuShown=true`', () => {
    expect(getPopper(wrapper).length).toBe(1);
  });

  test('does not render children when `isMenuShown=false`', () => {
    wrapper.setProps({ isMenuShown: false });
    expect(wrapper.length).toBe(1);
    expect(getPopper(wrapper).length).toBe(0);
  });

  test('updates the placement', () => {
    expect(getPopper(wrapper).prop('placement')).toBe('bottom-start');

    wrapper.setProps({
      align: 'right',
      dropup: true,
    });

    expect(getPopper(wrapper).prop('placement')).toBe('top-end');
  });

  test('updates the positioning type', () => {
    // Uses absolute positioning by default.
    expect(isPositionFixed(wrapper)).toBe(false);

    wrapper.setProps({ positionFixed: true });
    expect(isPositionFixed(wrapper)).toBe(true);
  });

  test('calls `onMenuToggle`', () => {
    const onMenuToggle = jest.fn();

    wrapper.setProps({ onMenuToggle });

    expect(onMenuToggle).toHaveBeenCalledTimes(0);

    wrapper.setProps({ isMenuShown: false });
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    // Shouldn't be called again if not hidden first.
    wrapper.setProps({ isMenuShown: false });
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    wrapper.setProps({ isMenuShown: true });
    expect(onMenuToggle).toHaveBeenCalledTimes(2);
  });

  test(
    'provides a fallback inputHeight when there is no reference element',
    () => {
      wrapper.setProps({ referenceElement: undefined });
      expect(wrapper.find(Menu).prop('inputHeight')).toBe(0);
    }
  );
});
