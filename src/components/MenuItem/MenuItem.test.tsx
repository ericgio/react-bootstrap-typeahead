import React from 'react';

import * as baseStories from './BaseMenuItem.stories';
import * as stories from './MenuItem.stories';

import {
  composeStories,
  generateSnapshots,
  screen,
  render,
  userEvent,
} from '../../tests/helpers';

const { Default: BaseDefault, Active, Disabled } = composeStories(baseStories);
const { Default } = composeStories(stories);

describe('<BaseMenuItem>', () => {
  generateSnapshots(baseStories);

  it('triggers an event when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<BaseDefault onClick={onClick} />);

    const item = screen.getByRole('link');
    await user.click(item);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a default href', () => {
    render(<BaseDefault />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#');
  });

  it('renders an href passed to the MenuItem', () => {
    const href = '/some/link';
    render(<BaseDefault href={href} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', href);
  });

  it('renders an active base menu item', () => {
    render(<Active />);
    expect(screen.getByRole('link')).toHaveClass('active');
  });

  it('renders a disabled base menu item', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Disabled disabled onClick={onClick} />);

    const item = screen.getByRole('link');
    await user.click(item);

    expect(item).toHaveClass('disabled');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});

describe('<MenuItem>', () => {
  generateSnapshots(stories);

  it('renders a MenuItem', () => {
    render(<Default />);

    const option = screen.getByRole('option');
    expect(option).toHaveAttribute('aria-label', 'test label');
    expect(option).toHaveAttribute('aria-selected', 'false');
    expect(option).toHaveAttribute('id', 'test-id-item-0');
  });

  it('conditionally calls `onInitialItemChange`', () => {
    const onInitialItemChange = jest.fn();
    const context = { onInitialItemChange };

    const { rerender } = render(
      <Default context={context} props={{ position: 1 }} />
    );
    expect(onInitialItemChange).toHaveBeenCalledTimes(0);

    rerender(<Default context={context} props={{ position: 0 }} />);
    expect(onInitialItemChange).toHaveBeenCalledTimes(1);
  });

  it('conditionally calls `onInitialItemChange`', () => {
    const onActiveItemChange = jest.fn();
    const context = {
      activeIndex: 1,
      onActiveItemChange,
    };

    const { rerender } = render(
      <Default context={context} props={{ position: 0 }} />
    );
    expect(onActiveItemChange).toHaveBeenCalledTimes(0);

    rerender(<Default context={context} props={{ position: 1 }} />);
    expect(onActiveItemChange).toHaveBeenCalledTimes(1);
  });

  it('changes the active state of the menu item', () => {
    render(<Default context={{ activeIndex: 0 }} />);

    const option = screen.getByRole('option');
    expect(option).toHaveClass('active');
    expect(option).toHaveAttribute('aria-selected', 'true');
  });

  it('sets the active state if it is the only result', () => {
    render(<Default context={{ isOnlyResult: true }} />);

    const option = screen.getByRole('option');
    expect(option).toHaveClass('active');
    expect(option).toHaveAttribute('aria-selected', 'true');
  });

  it('calls the click handlers', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onMenuItemClick = jest.fn();

    render(<Default context={{ onMenuItemClick }} props={{ onClick }} />);

    await user.click(screen.getByRole('option'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onMenuItemClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled menu item', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Default props={{ disabled: true, onClick }} />);

    const item = screen.getByRole('option');
    await user.click(item);

    expect(item).toHaveClass('disabled');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
