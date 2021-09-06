import React from 'react';

import Menu from '../../components/Menu';
import MenuItem from '../../components/MenuItem';

import {
  fireEvent,
  getItems,
  getMenu,
  noop,
  prepareSnapshot,
  render,
  screen,
} from '../helpers';

const options = [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }];

const TestComponent = (props) => (
  <Menu id="menu-id" scheduleUpdate={noop} {...props}>
    {options.map((o, idx) => (
      <MenuItem key={o.label} option={o} position={idx}>
        {o.label}
      </MenuItem>
    ))}
  </Menu>
);

describe('<Menu>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('renders a basic menu with menu items', () => {
    render(<TestComponent />);

    expect(getMenu(screen)).toHaveClass('rbt-menu dropdown-menu');
    expect(getItems(screen)).toHaveLength(3);
  });

  it('sets the maxHeight and other styles', () => {
    render(
      <TestComponent maxHeight="100px" style={{ backgroundColor: 'red' }} />
    );

    const menu = getMenu(screen);
    expect(menu).toHaveStyle('background-color: red');
    expect(menu).toHaveStyle('max-height: 100px');
  });

  it('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';
    render(
      <Menu
        emptyLabel={emptyLabel}
        id="menu-id"
        inputHeight={0}
        innerRef={undefined}
        scheduleUpdate={noop}
        text=""
      />
    );

    const items = getItems(screen);
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveClass('disabled');
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('adds an aria-label attribute to the menu', () => {
    render(<TestComponent aria-label="custom-label" />);
    expect(getMenu(screen)).toHaveAttribute('aria-label', 'custom-label');
  });

  it('updates the menu position if the input height changes', () => {
    const scheduleUpdate = jest.fn();
    const { rerender } = render(
      <TestComponent scheduleUpdate={scheduleUpdate} />
    );

    expect(scheduleUpdate).toHaveBeenCalledTimes(0);

    rerender(<TestComponent inputHeight={1} scheduleUpdate={scheduleUpdate} />);
    expect(scheduleUpdate).toHaveBeenCalledTimes(1);
  });

  it('prevents the input from blurring on mousedown', () => {
    render(<TestComponent />);

    const menu = getMenu(screen);

    // `false` means e.preventDefault was called.
    expect(fireEvent.mouseDown(menu)).toBe(false);
  });
});

it('<Menu.Divider>', () => {
  render(<Menu.Divider />);

  const divider = screen.getByRole('separator');
  expect(divider.tagName).toBe('DIV');
  expect(divider).toHaveClass('dropdown-divider');
});

it('<Menu.Header>', () => {
  const children = 'This is a menu header';
  render(<Menu.Header>{children}</Menu.Header>);

  const header = screen.getByRole('heading');
  expect(header.tagName).toBe('DIV');
  expect(header).toHaveClass('dropdown-header');
  expect(header).toHaveTextContent(children);
});
