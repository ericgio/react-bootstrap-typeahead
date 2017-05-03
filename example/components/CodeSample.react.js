import React from 'react';
import PropTypes from 'prop-types';

import Markdown from './Markdown';

const START_STR = '/* example-start */';
const END_STR = '/* example-end */';

class CodeSample extends React.Component {
  render() {
    // Strip out extraneous parts of the code.
    const code = this.props.children;
    const startIndex = code.indexOf(START_STR) + START_STR.length + 1;
    const endIndex = code.indexOf(END_STR);

    return (
      <Markdown className="code-sample">
        {`\`\`\`${this.props.lang}
${code.slice(startIndex, endIndex)}
        \`\`\``}
      </Markdown>
    );
  }
}

CodeSample.propTypes = {
  lang: PropTypes.string,
};

CodeSample.defaultProps = {
  lang: 'jsx',
};


export default CodeSample;
