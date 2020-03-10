import { noop } from 'lodash';
import React from 'react';

import TypeaheadManager from '../core/TypeaheadManager';

const context = {
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  items: [],
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  onMenuToggle: noop,
  results: [],
  selectHintOnEnter: false,
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

// Make sure certain event properties are present.
function getBaseEvent(properties = {}) {
  return {
    defaultPrevented: false,
    persist: noop,
    preventDefault: noop,
    ...properties,
  };
}

export function focus(wrapper, eventProperties) {
  getInput(wrapper).simulate('focus', getBaseEvent(eventProperties));
}

// Calls Enzyme's `simulate` method instead of the `onKeyDown` prop.
// Not recommended: https://github.com/airbnb/enzyme/issues/1412
export function simulateKeyDown(wrapper, value, eventProperties) {
  const input = getInput(wrapper);
  input.simulate('keyDown', {
    ...getBaseEvent(eventProperties),
    currentTarget: input,
    keyCode: value,
    which: value,
  });
}

export function keyDown(wrapper, value, eventProperties) {
  const input = getInput(wrapper);
  input.prop('onKeyDown')({
    ...getBaseEvent(eventProperties),
    currentTarget: input,
    keyCode: value,
    which: value,
  });
}

export function change(wrapper, value, eventProperties) {
  getInput(wrapper).prop('onChange')({
    ...getBaseEvent(eventProperties),
    currentTarget: { value },
  });
}
