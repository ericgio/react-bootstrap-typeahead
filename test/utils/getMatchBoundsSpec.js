import {expect} from 'chai';
import {getMatchBounds} from '../../src/utils/';

describe('getMatchBounds', () => {
  it('handles a normal string', () => {
    const bounds = getMatchBounds('This is a string.', 'This is');

    expect(bounds).to.exist;
    expect(bounds.start).to.equal(0);
    expect(bounds.end).to.equal(7);
  });

  it('is case-insensitive', () => {
    const bounds = getMatchBounds('This String Has Caps.', 'string has');

    expect(bounds).to.exist;
    expect(bounds.start).to.equal(5);
    expect(bounds.end).to.equal(15);
  });

  it('handles diacritical marks in the search string', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'schö');

    expect(bounds).to.exist;
    expect(bounds.start).to.equal(0);
    expect(bounds.end).to.equal(4);
  });

  it('matches composed diacritical marks', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'was schon');

    expect(bounds).to.exist;
    expect(bounds.start).to.equal(11);
    expect(bounds.end).to.equal(20);
  });

  it('matches combined diacritical marks', () => {
    const bounds = getMatchBounds(
      'Scho\u0308n ist, was scho\u0308n la\u0308sst.',
      'was schon'
    );

    expect(bounds).to.exist;
    expect(bounds.start).to.equal(12);
    expect(bounds.end).to.equal(22);
  });

});
