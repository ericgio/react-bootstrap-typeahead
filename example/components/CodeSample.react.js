/* eslint-disable import/no-extraneous-dependencies */

import { PrismCode } from 'react-prism';
import PropTypes from 'prop-types';
import React from 'react';

const START_STR = '/* example-start */';
const END_STR = '/* example-end */';

function getExampleCode(str) {
  return str.slice(
    str.indexOf(START_STR) + START_STR.length + 1,
    str.indexOf(END_STR)
  );
}

const CodeSample = ({ children, component, language }) => (
  <PrismCode className={`language-${language}`} component={component}>
    {getExampleCode(children)}
  </PrismCode>
);

CodeSample.propTypes = {
  component: PropTypes.string,
  language: PropTypes.string,
};

CodeSample.defaultProps = {
  component: 'pre',
  language: 'jsx',
};

export default CodeSample;
