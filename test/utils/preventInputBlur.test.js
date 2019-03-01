import { preventInputBlur } from '../../src/utils';

describe('preventInputBlur', () => {
  test('calls `preventDefault` on the event', () => {
    const e = {
      preventDefault: jest.fn(),
    };
    preventInputBlur(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });
});
