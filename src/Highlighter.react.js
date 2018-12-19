import PropTypes from 'prop-types';
import React from 'react';

import {getMatchBounds} from './utils';

/**
 * Stripped-down version of https://github.com/helior/react-highlighter
 *
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
class Highlighter extends React.PureComponent {
  _count = 0;

  render() {
    const children = this.props.search ?
      this._renderHighlightedChildren() :
      this.props.children;

    return <span>{children}</span>;
  }

  _renderHighlightedChildren() {
    const children = [];
    let {search, children: remaining, ...options} = this.props;

    while (remaining) {
      const bounds = getMatchBounds(remaining, search, options);

      if (!bounds) {
        this._count++;
        children.push(
          <span key={this._count}>
            {remaining}
          </span>
        );
        return children;
      }

      // Capture the string that leads up to a match...
      const nonMatch = remaining.slice(0, bounds.start);
      if (nonMatch) {
        this._count++;
        children.push(
          <span key={this._count}>
            {nonMatch}
          </span>
        );
      }

      // Now, capture the matching string...
      const match = remaining.slice(bounds.start, bounds.end);
      if (match) {
        this._count++;
        children.push(
          <mark className="rbt-highlight-text" key={this._count}>
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

Highlighter.propTypes = {
  beginningOnly: PropTypes.boolean,
  children: PropTypes.string.isRequired,
  multiword: PropTypes.boolean,
  search: PropTypes.string.isRequired,
};

export default Highlighter;
