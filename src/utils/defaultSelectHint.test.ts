import defaultSelectHint from './defaultSelectHint';

describe('defaultSelectHint', () => {
  let event, preventDefault;

  beforeEach(() => {
    preventDefault = jest.fn();

    event = {
      currentTarget: {
        value: 'Cali',
      },
      key: 'Tab',
      preventDefault,
    };
  });

  it('returns true when tab is pressed', () => {
    expect(defaultSelectHint(event)).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('checks hinting behavior when the right arrow key is pressed', () => {
    event = { ...event, key: 'ArrowRight' };

    event.currentTarget.selectionStart = 3;
    expect(defaultSelectHint(event)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(defaultSelectHint(event)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(defaultSelectHint(event)).toBe(true);
  });

  it('returns false for other keys', () => {
    // Build up a set of valid keys.
    []
      .concat(['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'])
      .concat('0123456789'.split(''))
      .concat('abcdefghijqlmnopqrstuvwxyz'.split('')) // Letter keys
      .concat(['Backspace', ' ', 'Escape', 'Enter', 'Tab'])
      .concat(';=,-./`'.split(''))
      .concat("[\\]'".split(''))
      .filter((key) => key !== 'Enter' && key !== 'ArrowRight' && key !== 'Tab')
      .forEach((key) => {
        event.key = key;
        expect(defaultSelectHint(event)).toBe(false);
      });
  });

  it('accepts a callback for custom behaviors', () => {
    event = { ...event, key: 'Enter' };
    const selectHint = (shouldSelectHint, e) =>
      e.key === 'Enter' || shouldSelectHint;

    expect(defaultSelectHint(event, selectHint)).toBe(true);
  });
});
