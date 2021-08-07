import React from 'react';

import MenuItem, { BaseMenuItem } from '../../components/MenuItem';
import {
  prepareSnapshot,
  screen,
  render,
  TestProvider,
  userEvent,
} from '../helpers';

describe('<BaseMenuItem>', () => {
  const TestComponent = (props) => (
    <BaseMenuItem {...props}>This is a base menu item.</BaseMenuItem>
  );

  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('renders an active base menu item', () => {
    render(<TestComponent active />);
    expect(screen.getByRole('link')).toHaveClass('active');
  });

  it('triggers an event when clicked', () => {
    const onClick = jest.fn();
    render(<TestComponent onClick={onClick} />);

    const item = screen.getByRole('link');
    userEvent.click(item);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled base menu item', () => {
    const onClick = jest.fn();
    render(<TestComponent disabled onClick={onClick} />);

    const item = screen.getByRole('link');
    userEvent.click(item);

    expect(item).toHaveClass('disabled');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('renders a default href', () => {
    render(<TestComponent />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#');
  });

  it('renders an href passed to the MenuItem', () => {
    const href = '/some/link';
    render(<TestComponent href={href} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', href);
  });
});

interface TestComponentProps {
  context?: Record<string, unknown>;
  props?: Record<string, unknown>;
}

describe('<MenuItem>', () => {
  const TestComponent = ({ context, props }: TestComponentProps) => (
    <TestProvider {...context} selected={[]}>
      {() => (
        <MenuItem {...props} option={{ label: 'test' }} position={0}>
          This is a menu item.
        </MenuItem>
      )}
    </TestProvider>
  );

  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('changes the active state of the menu item', () => {
    render(<TestComponent context={{ activeIndex: 0 }} />);
    expect(screen.getByRole('option')).toHaveClass('active');
  });

  it('sets the active state if it is the only result', () => {
    render(
      <TestComponent
        context={{ highlightOnlyResult: true, results: ['test'] }}
      />
    );
    expect(screen.getByRole('option')).toHaveClass('active');
  });

  it('triggers an event when clicked', () => {
    const onClick = jest.fn();
    render(<TestComponent props={{ onClick }} />);

    userEvent.click(screen.getByRole('option'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled menu item', () => {
    const onClick = jest.fn();
    render(<TestComponent props={{ disabled: true, onClick }} />);

    const item = screen.getByRole('option');
    userEvent.click(item);

    expect(item).toHaveClass('disabled');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
