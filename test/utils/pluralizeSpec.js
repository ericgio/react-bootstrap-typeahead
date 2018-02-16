import {expect} from 'chai';
import {pluralize} from '../../src/utils/';

describe('pluralize', () => {
  it('performs basic pluralization', () => {
    expect(pluralize('dog', 5)).to.equal('5 dogs');
  });

  it('does not pluralize for 1 item', () => {
    expect(pluralize('dog', 1)).to.equal('1 dog');
  });

  it('accepts custom pluralization', () => {
    expect(pluralize('radius', 2, 'radii')).to.equal('2 radii');
  });
});
