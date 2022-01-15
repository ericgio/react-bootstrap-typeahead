import React from 'react';

import * as stories from './Loader.stories';

import {
  composeStories,
  generateSnapshots,
  render,
  screen,
} from '../../tests/helpers';

const { Default } = composeStories(stories);

describe('<Loader>', () => {
  generateSnapshots(stories);

  it('renders a loading indicator', () => {
    render(<Default />);

    expect(screen.getByRole('status')).toHaveClass(
      'rbt-loader spinner-border spinner-border-sm'
    );
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders a custom label for accessibility', () => {
    render(<Default label="Waiting..." />);
    expect(screen.getByText('Waiting...')).toBeTruthy();
  });
});
