import { noop } from 'lodash';
import React from 'react';

import TypeaheadInput from '../src/core/TypeaheadInput';
import TypeaheadInner from '../src/core/TypeaheadInner';

export const context = {
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  results: [],
  selectHintOnEnter: false,
};

export const TestInputProvider = ({ children, ...props }) => (
  <TypeaheadInner {...props}>
    {(providerProps) => (
      <TypeaheadInput {...providerProps}>
        {children}
      </TypeaheadInput>
    )}
  </TypeaheadInner>
);

// Make sure e.persist() is present in events.
const baseEvent = {
  persist: noop,
};

/**
 * Finding React Elements
 */
export function getHint(wrapper) {
  return wrapper.find('.rbt-input-hint input').prop('value');
}

export function getInput(wrapper) {
  return wrapper.find('.rbt-input-main');
}

export function getFormControl(wrapper) {
  return wrapper.find('.form-control').hostNodes();
}

export function getMenu(wrapper) {
  return wrapper.find('.rbt-menu').hostNodes();
}

export function getMenuItems(wrapper) {
  // Rather than finding the <li> node, find the <a> so we can simulate clicks
  // if needed. This also skips over things like menu item dividers.
  return wrapper.find('a.dropdown-item');
}

export function getPaginator(wrapper) {
  return wrapper.find('.rbt-menu-pagination-option').hostNodes();
}

export function getTokens(wrapper) {
  return wrapper.find('.rbt-token');
}

/**
 * Events
 */
export function focus(wrapper) {
  getInput(wrapper).simulate('focus', baseEvent);
}

export function keyDown(wrapper, value) {
  getInput(wrapper).simulate('keyDown', {
    ...baseEvent,
    keyCode: value,
    which: value,
  });
}

export function change(wrapper, value) {
  // Calling `simulate` doesn't actually change the value, so call the
  // `onChange` prop directly: https://github.com/airbnb/enzyme/issues/1412
  getInput(wrapper).prop('onChange')({ ...baseEvent, target: { value } });
}
