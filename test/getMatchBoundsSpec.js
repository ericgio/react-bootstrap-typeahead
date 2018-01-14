import {expect} from 'chai';
import {getMatchBounds} from '../src/utils/';

describe('getMatchBounds', () => {
  it('handles a normal string', () => {
    const {end, start} = getMatchBounds('This is a string.', 'This is');

    expect(start).to.equal(0);
    expect(end).to.equal(7);
  });

  it('is case-insensitive', () => {
    const {end, start} = getMatchBounds('This String Has Caps.', 'string has');

    expect(start).to.equal(5);
    expect(end).to.equal(15);
  });

  it('handles composed diacritical marks', () => {
    const {end, start} = getMatchBounds(
      'Schön ist, was schön lässt.',
      'was schon'
    );

    expect(start).to.equal(11);
    expect(end).to.equal(20);
  });

  it('handles combined diacritical marks', () => {
    const {end, start} = getMatchBounds(
      'Scho\u0308n ist, was scho\u0308n la\u0308sst.',
      'was schon'
    );

    expect(start).to.equal(12);
    expect(end).to.equal(22);
  });

});
