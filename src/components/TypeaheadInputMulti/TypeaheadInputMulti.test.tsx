import React from 'react';

import * as stories from './TypeaheadInputMulti.stories';

import {
  composeStories,
  fireEvent,
  generateSnapshots,
  getInput,
  getTokens,
  render,
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

  it('focuses the input', () => {
    const { container } = render(<Default />);

    // Test clicking the container, which forwards the click to the input.
    userEvent.click(container.firstElementChild);
    expect(getInput()).toHaveFocus();
  });

  it('does not focus a disabled input', () => {
    const { container } = render(<Disabled />);

    const input = getInput();
    expect(input).toBeDisabled();

    // Test clicking the container, which forwards the click to the input.
    userEvent.click(container.firstElementChild);
    expect(input).not.toHaveFocus();

    userEvent.click(input);
    expect(input).not.toHaveFocus();
  });

  it('prevents clicks on the input from bubbling', () => {
    const onClick = jest.fn();
    render(<Default onClick={onClick} value="calif" />);

    const input = getInput();

    input.focus();
    input.selectionStart = 2;
    // userEvent.click triggers the wrong behavior for some reason.
    fireEvent.click(input);

    // Cursor shouldn't move when the input is clicked once.
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(input.selectionStart).toBe(2);
  });

  it('calls the keydown handler', () => {
    const onKeyDown = jest.fn();
    render(<Default onKeyDown={onKeyDown} />);

    getInput().focus();
    userEvent.keyboard('{enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('focuses the last token', () => {
    const { container } = render(<Default />);

    getInput().focus();
    userEvent.keyboard('{backspace}');

    const tokens = getTokens(container);
    const lastToken = tokens[tokens.length - 1];

    expect(lastToken).toHaveFocus();
  });

  it('does not focus the last token when the input has a value', () => {
    render(<Default value="foo" />);

    const input = getInput();
    input.focus();
    userEvent.keyboard('{backspace}');

    expect(input).toHaveFocus();
  });
});
