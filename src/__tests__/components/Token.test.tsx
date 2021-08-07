import React from 'react';

import Token from '../../components/Token';
import { noop, prepareSnapshot, render, screen, userEvent } from '../helpers';

const option = {
  label: 'test option',
};

const ACTIVE_CLASS = 'rbt-token-active';
const DISABLED_CLASS = 'rbt-token-disabled';
const REMOVEABLE_CLASS = 'rbt-token-removeable';

const TestComponent = (props) => (
  <Token option={option} {...props}>
    This is a token
  </Token>
);

describe('<Token>', () => {
  it('renders a snapshot', () => {
    expect(
      prepareSnapshot(
        <>
          <TestComponent onRemove={noop} />
          <TestComponent disabled />
          <TestComponent href="/path/to/some/url" />
        </>
      )
    ).toMatchSnapshot();
  });

  it('renders non-removeable tokens', () => {
    render(
      <>
        <TestComponent onRemove={undefined} />
        <TestComponent disabled />
        <TestComponent readOnly />
      </>
    );

    expect(screen.queryAllByRole('button').length).toBe(0);
  });

  it('renders a removeable token', () => {
    const onRemove = jest.fn();
    render(<TestComponent onRemove={onRemove} />);

    const closeButton = screen.getByRole('button');
    const token = closeButton.parentElement;

    expect(token).toHaveClass(REMOVEABLE_CLASS);

    userEvent.click(closeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('makes disabled tokens non-interactive', () => {
    const { container } = render(
      <TestComponent disabled href="/path/to/some/url" />
    );

    const token = container.firstChild as Element;
    expect(token.tagName).toBe('DIV');
    expect(token).not.toHaveAttribute('href');
    expect(token).toHaveClass(DISABLED_CLASS);
  });
});

describe('<Token> event handlers', () => {
  let onBlur, onClick, onFocus, onRemove, token;

  beforeEach(() => {
    onBlur = jest.fn();
    onClick = jest.fn();
    onFocus = jest.fn();
    onRemove = jest.fn();

    const { container } = render(
      <TestComponent
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onRemove={onRemove}
      />
    );

    token = container.firstChild;
    expect(token).not.toHaveClass(ACTIVE_CLASS);
  });

  it('handles click events', () => {
    userEvent.click(token);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(token).toHaveClass(ACTIVE_CLASS);
  });

  it('handles focus and blur events', () => {
    token.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(token).toHaveClass(ACTIVE_CLASS);

    token.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(token).not.toHaveClass(ACTIVE_CLASS);
  });

  it('handles keydown events', () => {
    userEvent.keyboard('{backspace}');

    // `onRemove` called only when token is active.
    expect(onRemove).toHaveBeenCalledTimes(0);

    token.focus();
    userEvent.keyboard('{backspace}');
    expect(onRemove).toHaveBeenCalledTimes(1);

    // Other events are ignored.
    userEvent.keyboard('{enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
