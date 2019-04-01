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
        isMenuShown={false}
        referenceElement={document.createElement('div')}>
        {(props) => <Menu {...props} id="menu-id">This is the menu</Menu>}
      </Overlay>
    );
  });

  test('does not render children when `show=false`', () => {
    expect(wrapper.length).toBe(1);
    expect(getPopper(wrapper).length).toBe(0);
  });

  test('renders children `show=true`', () => {
    wrapper.setProps({ isMenuShown: true });
    expect(getPopper(wrapper).length).toBe(1);
  });

  test('updates the positioning type', () => {
    wrapper.setProps({ isMenuShown: true });

    // Uses absolute positioning by default.
    expect(isPositionFixed(wrapper)).toBe(false);

    wrapper.setProps({ positionFixed: true });
    expect(isPositionFixed(wrapper)).toBe(true);
  });

  test('calls `onMenuToggle`', () => {
    const onMenuToggle = jest.fn();

    wrapper.setProps({ onMenuToggle });

    expect(onMenuToggle).toHaveBeenCalledTimes(0);

    wrapper.setProps({ isMenuShown: true });
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    // Shouldn't be called again if not hidden first.
    wrapper.setProps({ isMenuShown: true });
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    wrapper.setProps({ isMenuShown: false });
    expect(onMenuToggle).toHaveBeenCalledTimes(2);
  });
});
