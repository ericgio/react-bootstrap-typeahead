import { expect } from 'chai';

import areEqual from '../../src/utils/areEqual';
import options from '../../example/exampleData';

const labelKey = 'name';

const customOne = {
  customOption: true,
  id: '0',
  [labelKey]: 'foo',
};

const customTwo = {
  customOption: true,
  id: '1',
  [labelKey]: 'foo',
};

const customThree = {
  customOption: true,
  id: '2',
  [labelKey]: 'bar',
};

describe('areEqual', () => {
  it('checks equality of the items', () => {
    expect(areEqual('foo', 'foo', labelKey)).to.equal(true);
    expect(areEqual('foo', 'bar', labelKey)).to.equal(false);

    expect(areEqual(options[0], options[0], labelKey)).to.equal(true);
    expect(areEqual(options[0], options[1], labelKey)).to.equal(false);

    expect(areEqual(customOne, customTwo, labelKey)).to.equal(true);
    expect(areEqual(customOne, customThree, labelKey)).to.equal(false);
  });
});
