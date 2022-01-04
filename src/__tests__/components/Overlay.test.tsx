import React from 'react';

import Menu from '../../components/Menu';
import Overlay, {
  Align,
  getModifiers,
  getPlacement,
} from '../../components/Overlay';

import { getMenu, render, screen, waitFor } from '../helpers';

interface PlacementPermutation {
  props: {
    align: Align;
    dropup: boolean;
  };
  received: string;
}

interface ModifierProps {
  align: Align;
  flip: boolean;
}

const TestComponent = (props) => (
  <Overlay referenceElement={document.createElement('div')} {...props}>
    {(menuProps) => (
      <Menu {...menuProps} id="menu-id" text="">
        This is the menu
      </Menu>
    )}
  </Overlay>
);

describe('<Overlay>', () => {
  it('renders children when `isMenuShown=true`', async () => {
    render(<TestComponent isMenuShown />);

    await waitFor(() => {
      expect(getMenu()).toBeInTheDocument();
    });
  });

  it('does not render children when `isMenuShown=false`', () => {
    render(<TestComponent isMenuShown={false} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates the positioning type', async () => {
    // Uses absolute positioning by default.
    const { rerender } = render(<TestComponent isMenuShown />);

    // Wait for component to finish multiple renders.
    await waitFor(() => {
      expect(getMenu()).toHaveStyle('position: absolute');
    });

    rerender(<TestComponent isMenuShown positionFixed />);
    await waitFor(() => {
      expect(getMenu()).toHaveStyle('position: fixed');
    });
  });
});

describe('Overlay placement', () => {
  it('computes the placement string', () => {
    const permutations: PlacementPermutation[] = [
      { props: { align: 'right', dropup: false }, received: 'bottom-end' },
      { props: { align: 'left', dropup: false }, received: 'bottom-start' },
      { props: { align: 'justify', dropup: false }, received: 'bottom-start' },
      // @ts-ignore
      { props: { align: 'foo', dropup: false }, received: 'bottom-start' },
      { props: { align: 'right', dropup: true }, received: 'top-end' },
      { props: { align: 'left', dropup: true }, received: 'top-start' },
      { props: { align: 'justify', dropup: true }, received: 'top-start' },
      // @ts-ignore
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
    const selector = ({ name }) => name === 'flip';

    expect(getModifiers(props).find(selector).enabled).toBe(false);

    props.flip = true;
    expect(getModifiers(props).find(selector).enabled).toBe(true);
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
