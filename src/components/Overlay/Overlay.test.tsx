import React from 'react';

import { getModifiers, getPlacement } from './useOverlay';
import * as stories from './Overlay.stories';

import { Align } from '../../types';

import {
  composeStories,
  generateSnapshots,
  getMenu,
  render,
  screen,
  waitFor,
} from '../../tests/helpers';

const { Default } = composeStories(stories);

interface PlacementPermutation {
  props: {
    align: Align;
    dropup: boolean;
  };
  received: string;
}

interface Modifier {
  name: string;
}

interface ModifierProps {
  align: Align;
  flip: boolean;
}

describe('<Overlay>', () => {
  generateSnapshots(stories);

  it('renders the overlay', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(getMenu()).toBeInTheDocument();
    });
  });

  it('does not render the overlay when `isMenuShown=false`', () => {
    render(<Default isMenuShown={false} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates the positioning type', async () => {
    // The story uses fixed positioning by default.
    const { rerender } = render(<Default />);
    await waitFor(() => {
      expect(getMenu()).toHaveStyle('position: fixed');
    });

    rerender(<Default positionFixed={false} />);
    await waitFor(() => {
      expect(getMenu()).toHaveStyle('position: absolute');
    });
  });
});

describe('Overlay placement', () => {
  it('computes the placement string', () => {
    const permutations: PlacementPermutation[] = [
      { props: { align: 'right', dropup: false }, received: 'bottom-end' },
      { props: { align: 'left', dropup: false }, received: 'bottom-start' },
      { props: { align: 'justify', dropup: false }, received: 'bottom-start' },
      // @ts-expect-error
      { props: { align: 'foo', dropup: false }, received: 'bottom-start' },
      { props: { align: 'right', dropup: true }, received: 'top-end' },
      { props: { align: 'left', dropup: true }, received: 'top-start' },
      { props: { align: 'justify', dropup: true }, received: 'top-start' },
      // @ts-expect-error
      { props: { align: 'foo', dropup: true }, received: 'top-start' },
    ];

    permutations.forEach(({ props, received }) => {
      expect(getPlacement(props)).toBe(received);
    });
  });
});

describe('Overlay modifiers', () => {
  it('sets the `flip` modifier', () => {
    const props: ModifierProps = { align: 'justify', flip: false };
    const selector = ({ name }: Modifier) => name === 'flip';

    expect(getModifiers(props).find(selector)?.enabled).toBe(false);

    props.flip = true;
    expect(getModifiers(props).find(selector)?.enabled).toBe(true);
  });

  it('conditionally adds the `setWidth` modifier', () => {
    const props: ModifierProps = { align: 'justify', flip: false };

    const modifiers = getModifiers(props);
    expect(modifiers).toHaveLength(2);
    expect(
      modifiers.find(({ name }) => name === 'setPopperWidth')
    ).toBeTruthy();

    props.align = 'left';
    expect(getModifiers(props)).toHaveLength(1);

    props.align = 'right';
    expect(getModifiers(props)).toHaveLength(1);
  });
});
