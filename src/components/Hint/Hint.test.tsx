import { defaultShouldSelect } from './Hint';

describe('<Hint>', () => {
  // TODO...
});

describe('defaultShouldSelect', () => {
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
    expect(defaultShouldSelect(event)).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('checks hinting behavior when the right arrow key is pressed', () => {
    event = { ...event, key: 'ArrowRight' };

    event.currentTarget.selectionStart = 3;
    expect(defaultShouldSelect(event)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(defaultShouldSelect(event)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(defaultShouldSelect(event)).toBe(true);
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
        expect(defaultShouldSelect(event)).toBe(false);
      });
  });

  it('accepts a callback for custom behaviors', () => {
    event = { ...event, key: 'Enter' };
    const shouldSelect = (shouldSelectHint, e) => {
      return e.key === 'Enter' || shouldSelectHint;
    };

    expect(defaultShouldSelect(event, shouldSelect)).toBe(true);
  });
});
