// @flow

import PropTypes from 'prop-types';
import React from 'react';

import { getMatchBounds } from '../utils';

const propTypes = {
  children: PropTypes.string.isRequired,
  highlightClassName: PropTypes.string,
  search: PropTypes.string.isRequired,
};

const defaultProps = {
  highlightClassName: 'rbt-highlight-text',
};

type HighlighterProps = {
  children: string,
  highlightClassName: string,
  search: string,
};

// React 16.0 added support for returning arrays and strings from components.
// TODO: Get rid of this once support for React < 16 is dropped.
function wrapChildren(children) {
  /* istanbul ignore next */
  return React.version >= '16' ? children : <span>{children}</span>;
}

/**
 * Stripped-down version of https://github.com/helior/react-highlighter
 *
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
class Highlighter extends React.PureComponent<HighlighterProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  render() {
    const { children, highlightClassName, search } = this.props;

    if (!search || !children) {
      return wrapChildren(children);
    }

    let matchCount = 0;
    let remaining = children;

    const highlighterChildren = [];

    while (remaining) {
      const bounds = getMatchBounds(remaining, search);

      // No match anywhere in the remaining string, stop.
      if (!bounds) {
        highlighterChildren.push(remaining);
        break;
      }

      // Capture the string that leads up to a match.
      const nonMatch = remaining.slice(0, bounds.start);
      if (nonMatch) {
        highlighterChildren.push(nonMatch);
      }

      // Capture the matching string.
      const match = remaining.slice(bounds.start, bounds.end);
      if (match) {
        matchCount += 1;
        highlighterChildren.push(
          <mark className={highlightClassName} key={matchCount}>
            {match}
          </mark>
        );
      }

      // And if there's anything left over, continue the loop.
      remaining = remaining.slice(bounds.end);
    }

    return wrapChildren(highlighterChildren);
  }
}

export default Highlighter;
