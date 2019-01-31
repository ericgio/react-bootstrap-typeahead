import { expect } from 'chai';
import { range } from 'lodash';

import shouldSelectHint from '../../src/utils/shouldSelectHint';
import { RETURN, RIGHT, TAB } from '../../src/constants';

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

  it('returns false when there is no hint', () => {
    props.hintText = '';
    expect(shouldSelectHint(event, props)).to.equal(false);
  });

  it('returns true when tab is pressed', () => {
    expect(shouldSelectHint(event, props)).to.equal(true);
  });

  it('behavior when the right arrow key is pressed', () => {
    event = {
      keyCode: RIGHT,
      target: {
        selectionStart: 3,
      },
    };

    expect(shouldSelectHint(event, props)).to.equal(false);

    event.target.selectionStart = 4;
    expect(shouldSelectHint(event, props)).to.equal(true);

    event.target.selectionStart = null;
    expect(shouldSelectHint(event, props)).to.equal(true);
  });

  it('behavior when enter is pressed', () => {
    event = {
      keyCode: RETURN,
    };

    expect(shouldSelectHint(event, props)).to.equal(false);

    props.selectHintOnEnter = true;
    expect(shouldSelectHint(event, props)).to.equal(true);
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
      .filter((keyCode) => (
        keyCode !== RETURN &&
        keyCode !== RIGHT &&
        keyCode !== TAB
      ))
      .forEach((keyCode) => {
        event.keyCode = keyCode;
        expect(shouldSelectHint(event, props)).to.equal(false);
      });
  });
});
