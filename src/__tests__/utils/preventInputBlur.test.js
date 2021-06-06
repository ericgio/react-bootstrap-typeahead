import { preventInputBlur } from '../../utils';

describe('preventInputBlur', () => {
  it('calls `preventDefault` on the event', () => {
    const e = {
      preventDefault: jest.fn(),
    };
    preventInputBlur(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });
});
