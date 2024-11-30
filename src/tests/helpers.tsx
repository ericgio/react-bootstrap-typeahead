/* eslint-disable import/no-extraneous-dependencies */
/* istanbul ignore file */

import React, { ReactNode } from 'react';
import { Meta } from '@storybook/react';
import { composeStories, composeStory } from '@storybook/testing-react';
import { render, screen, RenderResult } from '@testing-library/react';

import {
  defaultContext,
  TypeaheadContext,
  TypeaheadContextType,
} from '../core/Context';

export * from '@storybook/testing-react';
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export function noop() {}

interface StoriesImport {
  default: Meta;
}

interface TestOptions {
  /**
   * Get the element to snapshot, either synchronously or asynchronously.
   */
  getElement?: (
    wrapper: RenderResult
  ) => Promise<ChildNode | null> | ChildNode | null;
}

type ComposedStory = ReturnType<typeof composeStory>;

export function generateSnapshots(
  stories: StoriesImport,
  { getElement = (wrapper) => wrapper.container.firstChild }: TestOptions = {}
) {
  const composed = composeStories(stories);

  Object.entries<ComposedStory>(composed).forEach(([storyName, Story]) => {
    if (Story.parameters?.snapshot?.skip) return;

    test(`${storyName} story renders snapshot`, async () => {
      const view = render(<Story />);
      expect(await getElement(view)).toMatchSnapshot();
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

export function getInput(): HTMLInputElement {
  return screen.getByRole('combobox');
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
