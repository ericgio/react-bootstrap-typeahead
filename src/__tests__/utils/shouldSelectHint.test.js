import { range } from 'lodash';

import shouldSelectHint from '../../utils/shouldSelectHint';
import { RETURN, RIGHT, TAB } from '../../constants';

describe('shouldSelectHint', () => {
  let event, props;

  beforeEach(() => {
    event = {
      keyCode: TAB,
    };

    props = {
      hintText: 'California',
      selectHintOnEnter: false,
      value: 'Cali',
    };
  });

  test('returns false when there is no hint', () => {
    props.hintText = '';
    expect(shouldSelectHint(event, props)).toBe(false);
  });

  test('returns true when tab is pressed', () => {
    expect(shouldSelectHint(event, props)).toBe(true);
  });

  test('behavior when the right arrow key is pressed', () => {
    event = {
      currentTarget: {
        selectionStart: 3,
      },
      keyCode: RIGHT,
    };

    expect(shouldSelectHint(event, props)).toBe(false);

    event.currentTarget.selectionStart = 4;
    expect(shouldSelectHint(event, props)).toBe(true);

    event.currentTarget.selectionStart = null;
    expect(shouldSelectHint(event, props)).toBe(true);
  });

  test('behavior when enter is pressed', () => {
    event = {
      keyCode: RETURN,
    };

    expect(shouldSelectHint(event, props)).toBe(false);

    props.selectHintOnEnter = true;
    expect(shouldSelectHint(event, props)).toBe(true);
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
        expect(shouldSelectHint(event, props)).toBe(false);
      });
  });
});
