import escapeStringRegexp from 'escape-string-regexp';
import stripDiacritics from './stripDiacritics';

const CASE_INSENSITIVE = 'i';
const COMBINING_MARKS = /[\u0300-\u036F]/;

export default function getMatchBounds(subject, search, options = {}) {
  const {multiword = false, beginningOnly = false} = options;
  const boundry = beginningOnly ? '\\b' : '';
  search = boundry + escapeStringRegexp(stripDiacritics(search));

  if (multiword) {
    const searchsplit = search.split(/\s+/);
    if (searchsplit.length > 1) {
      search += '|' + boundry + searchsplit.join('|' + boundry);
    }
  }

  search = new RegExp(
    search,
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
        start++;
      }
    }

    // Similarly, increment the length of the match string if it contains a
    // combining mark.
    for (let ii = start; ii <= start + matchLength; ii++) {
      if (COMBINING_MARKS.test(subject[ii])) {
        matchLength++;
      }
    }
  }

  return {
    end: start + matchLength,
    start,
  };
}
