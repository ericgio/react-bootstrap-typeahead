/* global Prism */

import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const START_STR = '/* example-start */';
const END_STR = '/* example-end */';

function getExampleCode(str) {
  return str.slice(
    str.indexOf(START_STR) + START_STR.length + 1,
    str.indexOf(END_STR)
  );
}

const CodeSample = ({ as: Component, children, language }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const highlight = () => Prism.highlightElement(ref.current);

    highlight();
  }, [ref]);

  return (
    <Component className={`language-${language}`} ref={ref}>
      {getExampleCode(children)}
    </Component>
  );
};

CodeSample.propTypes = {
  as: PropTypes.string,
  language: PropTypes.string,
};

CodeSample.defaultProps = {
  as: 'pre',
  language: 'jsx',
};

export default CodeSample;
