import { range } from 'lodash';

import { defaultShouldSelect } from '../../components/Hint';
import { RETURN, RIGHT, TAB } from '../../constants';

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
      keyCode: TAB,
      preventDefault,
    };
  });

  it('returns true when tab is pressed', () => {
    expect(defaultShouldSelect(event)).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('checks hinting behavior when the right arrow key is pressed', () => {
    event = { ...event, keyCode: RIGHT };

    event.currentTarget.selectionStart = 3;
    expect(defaultShouldSelect(event)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(defaultShouldSelect(event)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(defaultShouldSelect(event)).toBe(true);
  });

  it('returns false for other keycodes', () => {
    // Build up a set of valid keys.
    []
      .concat([37, 38, 39, 40]) // Arrow keys
      .concat(range(48, 58)) // Number keys
      .concat(range(65, 91)) // Letter keys
      .concat(range(96, 112)) // Numpad keys
      .concat([8, 13, 27, 32]) // backspace, spacebar, esc, return
      .concat(range(186, 193)) // ;=,-./`
      .concat(range(219, 223)) // [\]'
      .filter(
        (keyCode) => keyCode !== RETURN && keyCode !== RIGHT && keyCode !== TAB
      )
      .forEach((keyCode) => {
        event.keyCode = keyCode;
        expect(defaultShouldSelect(event)).toBe(false);
      });
  });

  it('accepts a callback for custom behaviors', () => {
    event = { ...event, keyCode: RETURN };
    const shouldSelect = (shouldSelectHint, e) => {
      if (e.keyCode === RETURN) {
        return true;
      }
      return shouldSelectHint;
    };

    expect(defaultShouldSelect(event, shouldSelect)).toBe(true);
  });
});
