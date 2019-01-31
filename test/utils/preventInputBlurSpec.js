import { expect } from 'chai';
import sinon from 'sinon';

import { preventInputBlur } from '../../src/utils';

describe('preventInputBlur', () => {
  it('calls `preventDefault` on the event', () => {
    const e = {
      preventDefault: sinon.spy(),
    };
    preventInputBlur(e);
    expect(e.preventDefault.calledOnce).to.equal(true);
  });
});
