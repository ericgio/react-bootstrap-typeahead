import { escapeStringRegexp, getMatchBounds } from '../../utils';

describe('getMatchBounds', () => {
  test('handles a normal string', () => {
    const bounds = getMatchBounds('This is a string.', 'This is');

    expect(bounds.start).toBe(0);
    expect(bounds.end).toBe(7);
  });

  test('returns null when there is no match', () => {
    expect(getMatchBounds('foo', 'bar')).toBe(null);
  });

  test('is case-insensitive', () => {
    const bounds = getMatchBounds('This String Has Caps.', 'string has');

    expect(bounds.start).toBe(5);
    expect(bounds.end).toBe(15);
  });

  test('handles diacritical marks in the search string', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'schö');

    expect(bounds.start).toBe(0);
    expect(bounds.end).toBe(4);
  });

  test('matches composed diacritical marks', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'was schon');

    expect(bounds.start).toBe(11);
    expect(bounds.end).toBe(20);
  });

  test('matches combined diacritical marks', () => {
    const bounds = getMatchBounds(
      'Scho\u0308n ist, was scho\u0308n la\u0308sst.',
      'was schon'
    );

    expect(bounds.start).toBe(12);
    expect(bounds.end).toBe(22);
  });
});

describe('escapeStringRegexp', () => {
  test('main', () => {
    expect(escapeStringRegexp('\\ ^ $ * + ? . ( ) | { } [ ]'))
      .toBe('\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]');
  });

  test('escapes `-` in a way compatible with PCRE', () => {
    expect(escapeStringRegexp('foo - bar')).toBe('foo \\x2d bar');
  });
});
