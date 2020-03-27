import { range } from 'lodash';

import { defaultShouldSelect } from '../../components/Hint.react';
import { RETURN, RIGHT, TAB } from '../../constants';

describe('<Hint>', () => {
  // TODO...
});

describe('defaultShouldSelect', () => {
  let event, preventDefault, state;

  beforeEach(() => {
    preventDefault = jest.fn();

    event = {
      currentTarget: {
        value: 'Cali',
      },
      keyCode: TAB,
      preventDefault,
    };

    state = {
      selectHintOnEnter: false,
    };
  });

  test('returns true when tab is pressed', () => {
    expect(defaultShouldSelect(event, state)).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  test('behavior when the right arrow key is pressed', () => {
    event = { ...event, keyCode: RIGHT };

    event.currentTarget.selectionStart = 3;
    expect(defaultShouldSelect(event, state)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(defaultShouldSelect(event, state)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(defaultShouldSelect(event, state)).toBe(true);
  });

  test('behavior when enter is pressed', () => {
    event = { ...event, keyCode: RETURN };

    expect(defaultShouldSelect(event, state)).toBe(false);

    state.selectHintOnEnter = true;
    expect(defaultShouldSelect(event, state)).toBe(true);
  });

  test('returns false for other keycodes', () => {
    // Build up a set of valid keys.
    []
      .concat([37, 38, 39, 40]) // Arrow keys
      .concat(range(48, 58)) // Number keys
      .concat(range(65, 91)) // Letter keys
      .concat(range(96, 112)) // Numpad keys
      .concat([8, 13, 27, 32]) // backspace, spacebar, esc, return
      .concat(range(186, 193)) // ;=,-./`
      .concat(range(219, 223)) // [\]'
      .filter((keyCode) => (
        keyCode !== RETURN &&
        keyCode !== RIGHT &&
        keyCode !== TAB
      ))
      .forEach((keyCode) => {
        event.keyCode = keyCode;
        expect(defaultShouldSelect(event, state)).toBe(false);
      });
  });

  test('accepts a callback for custom behaviors', () => {
    event = { ...event, keyCode: RETURN };
    state.shouldSelect = (shouldSelectHint, e) => {
      // Selects the hint even though `selectHintOnEnter` is false.
      if (e.keyCode === RETURN) {
        return true;
      }
      return shouldSelectHint;
    };

    expect(defaultShouldSelect(event, state)).toBe(true);
  });
});
