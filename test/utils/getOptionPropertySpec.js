import { expect } from 'chai';

import getOptionProperty from '../../src/utils/getOptionProperty';

describe('getOptionProperty', () => {
  it('retrieves the property from the option', () => {
    expect(getOptionProperty({ foo: 'bar' }, 'foo')).to.equal('bar');
    expect(getOptionProperty('foo')).to.equal(undefined);
  });
});
