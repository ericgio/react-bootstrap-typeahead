import React from 'react';

import * as stories from './ClearButton.stories';

import {
  composeStories,
  fireEvent,
  generateSnapshots,
  render,
  screen,
  userEvent,
} from '../../tests/helpers';

const { Default, Large } = composeStories(stories);

describe('<ClearButton>', () => {
  generateSnapshots(stories);

  it('renders a default clear button', () => {
    render(<Default />);
    expect(screen.getByRole('button').className).toBe('close rbt-close');
  });

  it('renders a large clear button', () => {
    render(<Large />);
    expect(screen.getByRole('button').className).toContain('rbt-close-lg');
  });

  it('registers a click', () => {
    const onClick = jest.fn();
    render(<Default onClick={onClick} />);

    const button = screen.getByRole('button');
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents the default backspace behavior', () => {
    const onKeyDown = jest.fn();
    let isDefault;

    render(<Default onKeyDown={onKeyDown} />);

    const button = screen.getByRole('button');

    isDefault = fireEvent.keyDown(button, {
      key: 'Backspace',
    });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(isDefault).toBe(false);

    isDefault = fireEvent.keyDown(button, {
      key: 'Enter',
    });

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(isDefault).toBe(true);
  });
});
