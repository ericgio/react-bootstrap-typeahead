import escapeStringRegexp from 'escape-string-regexp';
import PropTypes from 'prop-types';
import * as React from 'react';

import stripDiacritics from './utils/stripDiacritics';

function getMatchBoundaries(subject, search) {
  const matches = search.exec(stripDiacritics(subject));
  if (matches) {
    return {
      first: matches.index,
      last: matches.index + matches[0].length,
    };
  }
}

/**
 * Stripped-down version of https://github.com/helior/react-highlighter
 *
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
class Highlighter extends React.Component {
  _count = 0;

  render() {
    const children = this.props.search ?
      this._renderHighlightedChildren() :
      this.props.children;

    return <span>{children}</span>;
  }

  _renderHighlightedChildren() {
    const children = [];
    const search = new RegExp(
      escapeStringRegexp(this.props.search),
      'i' // Case-insensitive
    );

    let remaining = this.props.children;

    while (remaining) {
      if (!search.test(stripDiacritics(remaining))) {
        this._count++;
        children.push(
          <span key={this._count}>
            {remaining}
          </span>
        );
        return children;
      }

      const boundaries = getMatchBoundaries(remaining, search);

      // Capture the string that leads up to a match...
      const nonMatch = remaining.slice(0, boundaries.first);
      if (nonMatch) {
        this._count++;
        children.push(
          <span key={this._count}>
            {nonMatch}
          </span>
        );
      }

      // Now, capture the matching string...
      const match = remaining.slice(boundaries.first, boundaries.last);
      if (match) {
        this._count++;
        children.push(
          <mark className="rbt-highlight-text" key={this._count}>
            {match}
          </mark>
        );
      }

      // And if there's anything left over, recursively run this method again.
      remaining = remaining.slice(boundaries.last);
    }

    return children;
  }
}

Highlighter.propTypes = {
  children: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
};

export default Highlighter;
