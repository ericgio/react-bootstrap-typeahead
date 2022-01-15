/* eslint-disable import/no-extraneous-dependencies */
/* istanbul ignore file */

import { axe } from 'jest-axe';
import React, { ReactNode } from 'react';
import renderer from 'react-test-renderer';
import { Meta } from '@storybook/react';
import { composeStories, composeStory } from '@storybook/testing-react';
import { screen } from '@testing-library/react';

import {
  defaultContext,
  TypeaheadContext,
  TypeaheadContextType,
} from '../core/Context';

export { axe };
export * from '@storybook/testing-react';
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function prepareSnapshot(element: React.ReactElement) {
  return renderer.create(element).toJSON();
}

interface StoriesImport {
  default: Meta;
}

type ComposedStory = ReturnType<typeof composeStory>;

export function generateSnapshots(stories: StoriesImport) {
  const composed = composeStories(stories);

  Object.entries<ComposedStory>(composed).forEach(([storyName, Story]) => {
    if (Story.parameters?.snapshot?.skip) return;

    test(`${storyName} story renders snapshot`, async () => {
      expect(prepareSnapshot(<Story />)).toMatchSnapshot();
    });
  });
}

interface HintProviderProps extends Partial<TypeaheadContextType> {
  children?: ReactNode;
}

export const HintProvider = ({ children, ...context }: HintProviderProps) => {
  return (
    <TypeaheadContext.Provider
      value={{
        ...defaultContext,
        ...context,
      }}>
      {children}
    </TypeaheadContext.Provider>
  );
};

/**
 * Finding elements
 */
export function getHint(container: HTMLElement) {
  return container.getElementsByClassName('rbt-input-hint')[0];
}

export async function findInput(multiple = false) {
  const role = multiple ? 'textbox' : 'combobox';
  return screen.findByRole(role);
}

export function getInput(): HTMLInputElement | null {
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

export function getTokens(container: HTMLElement) {
  return container.getElementsByClassName('rbt-token');
}

export async function waitForOverlay() {
  await findMenu();
}
