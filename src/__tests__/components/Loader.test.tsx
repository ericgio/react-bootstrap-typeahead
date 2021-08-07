import React from 'react';
import { render, screen } from '@testing-library/react';

import Loader from '../../components/Loader';
import { prepareSnapshot } from '../helpers';

describe('<Loader>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<Loader />)).toMatchSnapshot();
  });

  it('renders a loading indicator', () => {
    render(<Loader />);

    expect(screen.getByRole('status')).toHaveClass(
      'rbt-loader spinner-border spinner-border-sm'
    );
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders a custom label for accessibility', () => {
    render(<Loader label="Waiting..." />);
    expect(screen.getByText('Waiting...')).toBeTruthy();
  });
});
