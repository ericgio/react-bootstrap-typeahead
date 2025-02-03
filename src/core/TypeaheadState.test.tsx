import {
  clearTypeahead,
  clickOrFocusInput,
  getInitialState,
  hideMenu,
  toggleMenu,
} from './TypeaheadState';

import { defaultProps, defaultState } from '../tests/data';

describe('State modifiers', () => {
  it('calls the clearTypeahead modifier', () => {
    const props = {
      ...defaultProps,
      defaultOpen: false,
      defaultSelected: [],
    };

    const state = {
      ...defaultState,
      isFocused: true,
    };

    expect(clearTypeahead(state, props)).toEqual({
      ...defaultState,
      isFocused: true,
    });
  });

  it('calls the clickOrFocusInput modifier', () => {
    const state = {
      ...defaultState,
      isFocused: false,
      showMenu: false,
    };

    expect(clickOrFocusInput(state)).toEqual({
      ...defaultState,
      isFocused: true,
      showMenu: true,
    });
  });

  it('calls the getInitialState modifier', () => {
    expect(
      getInitialState({
        ...defaultProps,
        defaultInputValue: 'foo',
        defaultOpen: false,
        defaultSelected: [],
      })
    ).toEqual({
      ...defaultState,
      text: 'foo',
    });

    expect(
      getInitialState({
        ...defaultProps,
        defaultInputValue: 'foo',
        defaultOpen: true,
        defaultSelected: ['bar', 'foo'],
      })
    ).toEqual({
      ...defaultState,
      selected: ['bar'],
      showMenu: true,
      text: 'bar',
    });
  });

  it('calls the hideMenu modifier', () => {
    const props = {
      ...defaultProps,
      defaultSelected: [],
    };

    expect(hideMenu(defaultState, props)).toEqual({
      ...defaultState,
      activeIndex: -1,
      activeItem: undefined,
      initialItem: undefined,
      showMenu: false,
    });
  });

  it('calls the toggleMenu modifier', () => {
    const props = {
      ...defaultProps,
      defaultSelected: [],
    };

    expect(toggleMenu({ ...defaultState, showMenu: false }, props)).toEqual({
      ...defaultState,
      showMenu: true,
    });

    expect(toggleMenu({ ...defaultState, showMenu: true }, props)).toEqual({
      ...defaultState,
      activeIndex: -1,
      activeItem: undefined,
      initialItem: undefined,
      showMenu: false,
    });
  });
});
