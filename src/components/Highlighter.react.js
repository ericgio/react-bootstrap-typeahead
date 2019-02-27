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

/**
 * Stripped-down version of https://github.com/helior/react-highlighter
 *
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
class Highlighter extends React.PureComponent {
  render() {
    const children = this.props.search ?
      this._renderHighlightedChildren() :
      this.props.children;

    return <span>{children}</span>;
  }

  _renderHighlightedChildren() {
    const children = [];

    let count = 0;
    let remaining = this.props.children;

    while (remaining) {
      const bounds = getMatchBounds(remaining, this.props.search);

      if (!bounds) {
        count += 1;
        children.push(
          <span key={count}>
            {remaining}
          </span>
        );
        return children;
      }

      // Capture the string that leads up to a match...
      const nonMatch = remaining.slice(0, bounds.start);
      if (nonMatch) {
        count += 1;
        children.push(
          <span key={count}>
            {nonMatch}
          </span>
        );
      }

      // Now, capture the matching string...
      const match = remaining.slice(bounds.start, bounds.end);
      if (match) {
        count += 1;
        children.push(
          <mark className={this.props.highlightClassName} key={count}>
            {match}
          </mark>
        );
      }

      // And if there's anything left over, continue the loop.
      remaining = remaining.slice(bounds.end);
    }

    return children;
  }
}

Highlighter.propTypes = propTypes;
Highlighter.defaultProps = defaultProps;

export default Highlighter;
