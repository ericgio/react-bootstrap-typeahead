import React from 'react';

import * as stories from './Token.stories';

import {
  composeStories,
  generateSnapshots,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../tests/helpers';

const ACTIVE_CLASS = 'rbt-token-active';
const DISABLED_CLASS = 'rbt-token-disabled';
const REMOVEABLE_CLASS = 'rbt-token-removeable';

const { Anchor, Disabled, Interactive, Static } = composeStories(stories);

describe('<Token>', () => {
  generateSnapshots(stories);

  it('renders non-removeable tokens', () => {
    render(
      <>
        <Static />
        <Anchor />
        <Disabled />
      </>
    );

    expect(screen.queryAllByRole('button').length).toBe(0);
  });

  it('renders a removeable token', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    const { container } = render(<Interactive onRemove={onRemove} />);

    const token = container.firstChild;
    expect(token).toHaveClass(REMOVEABLE_CLASS);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('makes disabled tokens non-interactive', () => {
    const { container } = render(<Disabled href="/path/to/some/url" />);

    const token = container.firstChild as HTMLElement;
    expect(token.tagName).toBe('DIV');
    expect(token).not.toHaveAttribute('href');
    expect(token).toHaveClass(DISABLED_CLASS);
  });

  it('handles events', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    const onClick = jest.fn();
    const onFocus = jest.fn();
    const onRemove = jest.fn();

    const { container } = render(
      <Interactive
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onRemove={onRemove}
      />
    );

    const token = container.firstChild as HTMLElement;

    expect(token).not.toHaveClass(ACTIVE_CLASS);

    token.focus();
    await waitFor(() => {
      expect(onFocus).toHaveBeenCalledTimes(1);
    });
    expect(token).toHaveClass(ACTIVE_CLASS);

    token.blur();
    await waitFor(() => {
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
    expect(token).not.toHaveClass(ACTIVE_CLASS);

    await user.click(token);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(2);
    expect(token).toHaveClass(ACTIVE_CLASS);

    // `onRemove` called only when token is active/focused.
    token.blur();
    await user.keyboard('{backspace}');
    expect(onRemove).toHaveBeenCalledTimes(0);

    token.focus();
    await user.keyboard('{backspace}');
    expect(onRemove).toHaveBeenCalledTimes(1);

    // Other events are ignored.
    await user.keyboard('{enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
