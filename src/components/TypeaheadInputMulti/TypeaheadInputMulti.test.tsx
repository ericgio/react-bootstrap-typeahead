import React from 'react';

import * as stories from './TypeaheadInputMulti.stories';

import {
  composeStories,
  fireEvent,
  generateSnapshots,
  getTokens,
  render,
  screen,
  userEvent,
} from '../../tests/helpers';

const { Default, Disabled } = composeStories(stories);

describe('<TypeaheadInputMulti>', () => {
  generateSnapshots(stories);

  it('renders a multi-select input with tokens', () => {
    const { container } = render(<Default />);
    // Find the token close buttons as a proxy for the token itself.
    expect(getTokens(container)).toHaveLength(3);
  });

  it('focuses the input', async () => {
    const user = userEvent.setup();
    const { container } = render(<Default />);

    // Test clicking the container, which forwards the click to the input.
    if (container.firstElementChild) {
      await user.click(container.firstElementChild);
    }
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('does not focus a disabled input', async () => {
    const user = userEvent.setup();
    const { container } = render(<Disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    // Test clicking the container, which forwards the click to the input.
    if (container.firstElementChild) {
      await user.click(container.firstElementChild);
    }
    expect(input).not.toHaveFocus();

    await user.click(input);
    expect(input).not.toHaveFocus();
  });

  it('prevents clicks on the input from bubbling', async () => {
    const onClick = jest.fn();
    render(<Default onClick={onClick} value="calif" />);

    const input: HTMLInputElement = screen.getByRole('textbox');

    input.focus();
    input.selectionStart = 2;
    // userEvent.click triggers the wrong behavior for some reason.
    fireEvent.click(input);

    // Cursor shouldn't move when the input is clicked once.
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(input.selectionStart).toBe(2);
  });

  it('calls the keydown handler', async () => {
    const user = userEvent.setup();
    const onKeyDown = jest.fn();
    render(<Default onKeyDown={onKeyDown} />);

    screen.getByRole('textbox').focus();
    await user.keyboard('{enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('focuses the last token', async () => {
    const user = userEvent.setup();
    const { container } = render(<Default />);

    screen.getByRole('textbox').focus();
    await user.keyboard('{backspace}');

    const tokens = getTokens(container);
    const lastToken = tokens[tokens.length - 1];

    expect(lastToken).toHaveFocus();
  });

  it('does not focus the last token when the input has a value', async () => {
    const user = userEvent.setup();
    render(<Default value="foo" />);

    const input = screen.getByRole('textbox');
    input.focus();
    await user.keyboard('{backspace}');

    expect(input).toHaveFocus();
  });
});
