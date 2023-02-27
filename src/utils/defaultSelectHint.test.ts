import { KeyboardEvent } from 'react';

import defaultSelectHint from './defaultSelectHint';
import { noop } from '../tests/helpers';

const defaultEvent = {
  currentTarget: {
    value: 'Cali',
  },
  key: 'Tab',
  preventDefault: noop,
} as KeyboardEvent<HTMLInputElement>;

describe('defaultSelectHint', () => {
  beforeEach(() => {
    defaultEvent.preventDefault = jest.fn();
  });

  it('returns true when tab is pressed', () => {
    expect(defaultSelectHint(defaultEvent)).toBe(true);
    expect(defaultEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('checks hinting behavior when the right arrow key is pressed', () => {
    const event = { ...defaultEvent, key: 'ArrowRight' };

    event.currentTarget.selectionStart = 3;
    expect(defaultSelectHint(event)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(defaultSelectHint(event)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(defaultSelectHint(event)).toBe(true);
  });

  it('returns false for other keys', () => {
    // Build up a set of valid keys.
    const keys: string[] = [
      ...['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
      ...'0123456789'.split(''),
      ...'abcdefghijqlmnopqrstuvwxyz'.split(''),
      ...['Backspace', ' ', 'Escape', 'Enter', 'Tab'],
      ...';=,-./`'.split(''),
      ..."[\\]'".split(''),
    ];

    keys
      .filter((key) => key !== 'Enter' && key !== 'ArrowRight' && key !== 'Tab')
      .forEach((key) => {
        defaultEvent.key = key;
        expect(defaultSelectHint(defaultEvent)).toBe(false);
      });
  });

  it('accepts a callback for custom behaviors', () => {
    const event = { ...defaultEvent, key: 'Enter' };
    const selectHint = (
      shouldSelectHint: boolean,
      e: KeyboardEvent<HTMLInputElement>
    ) => e.key === 'Enter' || shouldSelectHint;

    expect(defaultSelectHint(event, selectHint)).toBe(true);
  });
});
