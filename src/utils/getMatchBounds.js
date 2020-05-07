// @flow

import invariant from 'invariant';
import stripDiacritics from './stripDiacritics';

const CASE_INSENSITIVE = 'i';
const COMBINING_MARKS = /[\u0300-\u036F]/;

type MatchBounds = {
  end: number,
  start: number,
};

// Export for testing.
export function escapeStringRegexp(str: string): string {
  invariant(
    typeof str === 'string',
    '`escapeStringRegexp` expected a string.'
  );

  // Escape characters with special meaning either inside or outside character
  // sets. Use a simple backslash escape when it’s always valid, and a \unnnn
  // escape when the simpler form would be disallowed by Unicode patterns’
  // stricter grammar.
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}

export default function getMatchBounds(
  subject: string,
  str: string
): ?MatchBounds {
  const search = new RegExp(
    escapeStringRegexp(stripDiacritics(str)),
    CASE_INSENSITIVE
  );

  const matches = search.exec(stripDiacritics(subject));

  if (!matches) {
    return null;
  }

  let start = matches.index;
  let matchLength = matches[0].length;

  // Account for combining marks, which changes the indices.
  if (COMBINING_MARKS.test(subject)) {
    // Starting at the beginning of the subject string, check for the number of
    // combining marks and increment the start index whenever one is found.
    for (let ii = 0; ii <= start; ii++) {
      if (COMBINING_MARKS.test(subject[ii])) {
        start += 1;
      }
    }

    // Similarly, increment the length of the match string if it contains a
    // combining mark.
    for (let ii = start; ii <= start + matchLength; ii++) {
      if (COMBINING_MARKS.test(subject[ii])) {
        matchLength += 1;
      }
    }
  }

  return {
    end: start + matchLength,
    start,
  };
}
