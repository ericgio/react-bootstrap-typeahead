/* eslint-disable no-console */

import validateSelectedPropChange from '../../utils/validateSelectedPropChange';

describe('validateSelectedPropChange', () => {
  let str;

  beforeEach(() => {
    console.error = jest.fn((msg) => str = msg);
  });

  test('does not trigger a warning', () => {
    validateSelectedPropChange([], ['foo']);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('warns about uncontrolled to controlled change', () => {
    validateSelectedPropChange(undefined, []);
    const msg =
      'You are changing an uncontrolled typeahead to be controlled. Input ' +
      'elements should not switch from uncontrolled to controlled (or vice ' +
      'versa). Decide between using a controlled or uncontrolled element for ' +
      'the lifetime of the component.';

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(str).toMatch(msg);
  });

  test('warns about controlled to uncontrolled change', () => {
    validateSelectedPropChange([], undefined);
    const msg =
      'You are changing a controlled typeahead to be uncontrolled. Input ' +
      'elements should not switch from controlled to uncontrolled (or vice ' +
      'versa). Decide between using a controlled or uncontrolled element for ' +
      'the lifetime of the component.';

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(str).toMatch(msg);
  });
});
