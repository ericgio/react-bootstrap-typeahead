import React from 'react';

import * as stories from './TypeaheadMenu.stories';

import {
  composeStories,
  generateSnapshots,
  render,
  screen,
} from '../../tests/helpers';

const { CustomChildren, CustomOption, Pagination } = composeStories(stories);

describe('<TypeaheadMenu>', () => {
  generateSnapshots(stories);

  it('renders a custom option', () => {
    render(<CustomOption />);
    expect(screen.getByRole('option')).toHaveTextContent('New selection:');
  });

  it('renders custom new selection text', () => {
    render(<CustomOption newSelectionPrefix="Select new: " />);
    expect(screen.getByRole('option')).toHaveTextContent('Select new:');
  });

  it('renders a pagination item', () => {
    render(<Pagination />);

    const paginationItem = screen.queryByRole('option', {
      name: 'Display additional results...',
    });
    expect(paginationItem).toBeInTheDocument();
  });

  it('renders a custom pagination label', () => {
    const paginationText = 'Show more...';
    render(<Pagination paginationText={paginationText} />);

    expect(
      screen.queryByRole('option', { name: paginationText })
    ).toBeInTheDocument();
  });

  it('renders a custom pagination label component', () => {
    const paginationText = <div>Show more...</div>;
    render(<Pagination paginationText={paginationText} />);

    const item = screen.queryByRole('option', { name: 'Show more...' });
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('aria-label', '');
  });

  it('does not show a paginator when there are no results', () => {
    render(<Pagination options={[]} />);
    expect(
      screen.queryByRole('option', { name: 'Display additional results...' })
    ).not.toBeInTheDocument();
  });

  it('renders custom menu item children', () => {
    render(<CustomChildren />);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Population');
  });
});
