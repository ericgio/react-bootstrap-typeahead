/* istanbul ignore file */

import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import renderer from 'react-test-renderer';
import { screen } from '@testing-library/react';

import TypeaheadManager from '../core/TypeaheadManager';

export { axe };
export * from '@storybook/testing-react';
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

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

export async function findInput(multiple = false) {
  const role = multiple ? 'textbox' : 'combobox';
  return screen.findByRole(role);
}

export function getInput(): HTMLInputElement {
  // Look for either the single- or multi-select case.
  return screen.queryByRole('combobox') || screen.queryByRole('textbox');
}

export async function findItems() {
  return screen.findAllByRole('option');
}

export function getItems() {
  return screen.getAllByRole('option');
}

export async function findMenu() {
  return screen.findByRole('listbox');
}

export function getMenu() {
  return screen.queryByRole('listbox');
}

export async function findPaginator() {
  const items = await findItems();
  return items[items.length - 1];
}

export function getTokens(container) {
  return container.getElementsByClassName('rbt-token');
}

export async function waitForOverlay() {
  await findMenu();
}
