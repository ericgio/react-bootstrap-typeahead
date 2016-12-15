import React from 'react';

import Markdown from './Markdown.react';

const START_STR = '/* example-start */';
const END_STR = '/* example-end */';

const CodeSample = React.createClass({
  propTypes: {
    lang: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      lang: 'jsx',
    };
  },

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
  },
});

export default CodeSample;
