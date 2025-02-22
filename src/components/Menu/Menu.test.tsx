import React from 'react';

import * as stories from './Menu.stories';

import {
  composeStories,
  fireEvent,
  generateSnapshots,
  getItems,
  getMenu,
  render,
  screen,
} from '../../tests/helpers';

const { Default, Empty, HeaderAndDivider } = composeStories(stories);

describe('<Menu>', () => {
  generateSnapshots(stories);

  it('renders a basic menu with menu items', () => {
    render(<Default />);

    expect(getMenu()).toHaveClass('rbt-menu dropdown-menu');
    expect(getItems()).toHaveLength(3);
  });

  it('sets the maxHeight and other styles', () => {
    render(<Default maxHeight="100px" style={{ backgroundColor: 'red' }} />);

    const menu = getMenu();
    expect(menu).toHaveStyle('background-color: red');
    expect(menu).toHaveStyle('max-height: 100px');
  });

  it('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';
    render(<Empty emptyLabel={emptyLabel} />);

    const items = getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('renders the empty label when there are falsy children', () => {
    const emptyLabel = 'No matches.';
    render(<Empty emptyLabel={emptyLabel}>{false}</Empty>);

    const items = getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('adds an aria-label attribute to the menu', () => {
    render(<Default aria-label="custom-label" />);
    expect(getMenu()).toHaveAttribute('aria-label', 'custom-label');
  });

  it('prevents the input from blurring on mousedown', () => {
    render(<Default />);

    // `false` means e.preventDefault was called.
    expect(fireEvent.mouseDown(screen.getByRole('listbox'))).toBe(false);
  });

  it('checks the menu header and divider', () => {
    render(<HeaderAndDivider />);

    const header = screen.getByRole('heading');
    expect(header.tagName).toBe('DIV');
    expect(header).toHaveClass('dropdown-header');
    expect(header).toHaveTextContent('This is a menu header');

    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('dropdown-divider');
  });
});
