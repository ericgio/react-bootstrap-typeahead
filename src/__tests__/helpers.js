import { noop } from 'lodash';
import React from 'react';

import TypeaheadManager from '../core/TypeaheadManager';

const context = {
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  onMenuToggle: noop,
  results: [],
  selectHintOnEnter: false,
  setItem: noop,
};

const defaultProps = {
  inputRef: noop,
  labelKey: 'name',
  onAdd: noop,
  onChange: noop,
  onClear: noop,
  onFocus: noop,
  selectHintOnEnter: false,
  text: '',
};

export const TestProvider = ({ children, ...props }) => (
  <TypeaheadManager
    {...context}
    {...defaultProps}
    {...props}>
    {children}
  </TypeaheadManager>
);

// Make sure e.persist() is present in events.
const baseEvent = {
  persist: noop,
};

/**
 * Finding React Elements
 */
export function getHint(wrapper) {
  return wrapper.find('.rbt-input-hint').prop('value');
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

export function isFocused(element) {
  return element.getDOMNode() === document.activeElement;
}

/**
 * Events
 */
export function focus(wrapper) {
  getInput(wrapper).simulate('focus', baseEvent);
}

export function keyDown(wrapper, value) {
  const input = getInput(wrapper);
  input.simulate('keyDown', {
    ...baseEvent,
    currentTarget: input,
    keyCode: value,
    which: value,
  });
}

export function change(wrapper, value) {
  // Calling `simulate` doesn't actually change the value, so call the
  // `onChange` prop directly: https://github.com/airbnb/enzyme/issues/1412
  getInput(wrapper).prop('onChange')({
    ...baseEvent,
    currentTarget: { value },
  });
}
