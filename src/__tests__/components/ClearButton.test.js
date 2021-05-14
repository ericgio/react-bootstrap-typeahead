import React from 'react';

import ClearButton from '../../components/ClearButton';

import {
  fireEvent,
  prepareSnapshot,
  render,
  screen,
  userEvent,
} from '../helpers';

import { BACKSPACE, RETURN } from '../../constants';

describe('<ClearButton>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<ClearButton />)).toMatchSnapshot();
  });

  it('renders a default clear button', () => {
    render(<ClearButton />);
    expect(screen.getByRole('button').className).toBe('close rbt-close');
  });

  it('renders a large clear button', () => {
    render(<ClearButton size="large" />);
    expect(screen.getByRole('button').className).toContain('rbt-close-lg');
  });

  it('registers a click', () => {
    const onClick = jest.fn();
    render(<ClearButton onClick={onClick} />);

    const button = screen.getByRole('button');
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents the default backspace behavior', () => {
    const onKeyDown = jest.fn();
    let isDefault;

    render(<ClearButton onKeyDown={onKeyDown} />);

    const button = screen.getByRole('button');

    isDefault = fireEvent.keyDown(button, {
      keyCode: BACKSPACE,
    });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(isDefault).toBe(false);

    isDefault = fireEvent.keyDown(button, {
      keyCode: RETURN,
    });

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(isDefault).toBe(true);
  });
});
