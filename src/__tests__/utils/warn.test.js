/* eslint-disable no-console */

import warn, { resetWarned } from '../../utils/warn';

describe('warn', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    resetWarned();
  });

  test('does not trigger a warning for truthy values', () => {
    warn(true, 'Does not get called');
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('triggers a warning for falsy values', () => {
    warn(false, 'Does get called');
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('calls deprecation warnings only once', () => {
    warn(false, 'Feature `x` is deprecated');
    expect(console.error).toHaveBeenCalledTimes(1);

    warn(false, 'Feature `x` is deprecated');
    expect(console.error).toHaveBeenCalledTimes(1);

    warn(false, 'Feature `y` is deprecated');
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
