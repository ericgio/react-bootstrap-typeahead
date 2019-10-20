import { mount } from 'enzyme';
import React from 'react';
import { Popper } from 'react-popper';

import Menu from '../../components/Menu.react';
import Overlay, { getPlacement } from '../../core/Overlay';

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

  test('updates the positioning type', () => {
    // Uses absolute positioning by default.
    expect(isPositionFixed(wrapper)).toBe(false);

    wrapper.setProps({ positionFixed: true });
    expect(isPositionFixed(wrapper)).toBe(true);
  });

  test(
    'provides a fallback inputHeight when there is no reference element',
    () => {
      wrapper.setProps({ referenceElement: undefined });
      expect(wrapper.find(Menu).prop('inputHeight')).toBe(0);
    }
  );
});

describe('Overlay placement', () => {
  test('computes the placement string', () => {
    const permutations = [
      { props: { align: 'right', dropup: false }, received: 'bottom-end' },
      { props: { align: 'left', dropup: false }, received: 'bottom-start' },
      { props: { align: 'justify', dropup: false }, received: 'bottom-start' },
      { props: { align: 'foo', dropup: false }, received: 'bottom-start' },
      { props: { align: 'right', dropup: true }, received: 'top-end' },
      { props: { align: 'left', dropup: true }, received: 'top-start' },
      { props: { align: 'justify', dropup: true }, received: 'top-start' },
      { props: { align: 'foo', dropup: true }, received: 'top-start' },
    ];

    permutations.forEach(({ props, received }) => {
      expect(getPlacement(props)).toBe(received);
    });
  });
});
