import React from 'react';
import renderer from 'react-test-renderer';

import TypeaheadManager from '../core/TypeaheadManager';

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

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
  setItem: noop,
};

const defaultProps = {
  inputRef: noop,
  labelKey: 'name',
  onAdd: noop,
  onChange: noop,
  onClear: noop,
  onFocus: noop,
  text: '',
};

export const TestProvider = ({ children, ...props }) => (
  <TypeaheadManager {...context} {...defaultProps} {...props}>
    {children}
  </TypeaheadManager>
);

export function prepareSnapshot(element) {
  return renderer.create(element).toJSON();
}

/**
 * Finding elements
 */
export function getHint(container) {
  return container.getElementsByClassName('rbt-input-hint')[0];
}

export function getInput(screen) {
  // Look for either the single- or multi-select case.
  return screen.queryByRole('combobox') || screen.queryByRole('textbox');
}

export function getItems(screen) {
  return screen.getAllByRole('option');
}

export function getMenu(screen) {
  return screen.queryByRole('listbox');
}

export function getPaginator(screen) {
  const items = getItems(screen);
  return items[items.length - 1];
}

export function getTokens(container) {
  return container.getElementsByClassName('rbt-token');
}
