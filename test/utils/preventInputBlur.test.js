import sinon from 'sinon';

import { preventInputBlur } from '../../src/utils';

describe('preventInputBlur', () => {
  test('calls `preventDefault` on the event', () => {
    const e = {
      preventDefault: sinon.spy(),
    };
    preventInputBlur(e);
    expect(e.preventDefault.calledOnce).toBe(true);
  });
});
