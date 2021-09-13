import React from 'react';

import Token from '../../components/Token';
import TypeaheadInputMulti from '../../components/TypeaheadInputMulti';

import options from '../data';

import {
  fireEvent,
  getHint,
  getInput,
  getTokens,
  noop,
  prepareSnapshot,
  render,
  screen,
  TestProvider,
  userEvent,
} from '../helpers';

interface TestComponentProps {
  context?: Record<string, unknown>;
  props?: Record<string, unknown>;
}

const TestComponent = ({ context, props }: TestComponentProps) => {
  const selected = options.slice(1, 4);

  return (
    <TestProvider {...context} multiple onKeyDown={noop} selected={selected}>
      {({ getInputProps }) => (
        <TypeaheadInputMulti
          {...getInputProps()}
          {...props}
          selected={selected}>
          {selected.map((option) => (
            <Token key={option.name} option={option} onRemove={noop}>
              {option.name}
            </Token>
          ))}
        </TypeaheadInputMulti>
      )}
    </TestProvider>
  );
};

describe('<TypeaheadInputMulti>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('displays the selected text', () => {
    const text = 'foo';
    render(<TestComponent context={{ text }} />);
    expect(getInput(screen).value).toBe(text);
  });

  it('renders a multi-select input with tokens', () => {
    const { container } = render(<TestComponent />);
    // Find the token close buttons as a proxy for the token itself.
    expect(getTokens(container)).toHaveLength(3);
  });

  it('displays a hint and calls `shouldSelectHint`', () => {
    const initialItem = options[0];
    const shouldSelectHint = jest.fn();

    const { container } = render(
      <TestComponent
        context={{
          initialItem,
          isFocused: true,
          isMenuShown: true,
          text: 'Al',
        }}
        props={{
          shouldSelectHint,
        }}
      />
    );

    const hintInput = getHint(container);
    expect(hintInput).toHaveValue(initialItem.name);

    // No need to test the logic for `shouldSelectHint` here; just make sure
    // it's passed through to the `Hint` component and called.
    getInput(screen).focus();
    userEvent.tab();
    expect(shouldSelectHint).toHaveBeenCalledTimes(1);
  });

  it('focuses the input', () => {
    const { container } = render(<TestComponent />);

    // Test clicking the container, which forwards the click to the input.
    userEvent.click(container.firstElementChild);
    expect(getInput(screen)).toHaveFocus();
  });

  it('does not focus a disabled input', () => {
    const { container } = render(<TestComponent props={{ disabled: true }} />);

    const input = getInput(screen);
    expect(input).toBeDisabled();

    // Test clicking the container, which forwards the click to the input.
    userEvent.click(container.firstElementChild);
    expect(input).not.toHaveFocus();

    userEvent.click(input);
    expect(input).not.toHaveFocus();
  });

  it('prevents clicks on the input from bubbling', () => {
    const onClick = jest.fn();
    render(<TestComponent context={{ text: 'calif' }} props={{ onClick }} />);

    const input = getInput(screen);
    input.selectionStart = 2;
    // userEvent.click triggers the wrong behavior for some reason.
    fireEvent.click(input);

    // Cursor shouldn't move when the input is clicked once.
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(input.selectionStart).toBe(2);
  });

  it('calls the keydown handler', () => {
    const onKeyDown = jest.fn();
    render(<TestComponent props={{ onKeyDown }} />);

    getInput(screen).focus();
    userEvent.keyboard('{enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('focuses the last token', () => {
    const { container } = render(<TestComponent />);

    getInput(screen).focus();
    userEvent.keyboard('{backspace}');

    const tokens = getTokens(container);
    const lastToken = tokens[tokens.length - 1];

    expect(lastToken).toHaveFocus();
  });

  it('does not focus the last token when the input has a value', () => {
    render(<TestComponent context={{ text: 'foo' }} />);

    const input = getInput(screen);
    input.focus();
    userEvent.keyboard('{backspace}');

    expect(input).toHaveFocus();
  });
});
