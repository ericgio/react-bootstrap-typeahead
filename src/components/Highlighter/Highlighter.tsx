import PropTypes from 'prop-types';
import React from 'react';

import { escapeStringRegexp, stripDiacritics, uniqueId } from '../../utils';

const propTypes = {
  children: PropTypes.string.isRequired,
  highlightClassName: PropTypes.string,
  search: PropTypes.string.isRequired,
};

const defaultProps = {
  highlightClassName: 'rbt-highlight-text',
};

export interface HighlighterProps {
  children: string;
  highlightClassName?: string;
  search: string;
}

/**
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
const Highlighter = ({
  children,
  highlightClassName,
  search,
}: HighlighterProps) => {
  if (!search || !children) {
    return <>{children}</>;
  }

  const regex = new RegExp(
    `(${escapeStringRegexp(stripDiacritics(search))})`,
    'gi'
  );

  return (
    <>
      {stripDiacritics(children)
        .split(regex)
        .filter((part) => !!part)
        .map((part) =>
          regex.test(part) ? (
            <mark className={highlightClassName} key={uniqueId(part)}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
    </>
  );
};

Highlighter.propTypes = propTypes;
Highlighter.defaultProps = defaultProps;

export default Highlighter;
