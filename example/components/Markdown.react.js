import cx from 'classnames';
import marked from 'marked';
import * as React from 'react';

class Markdown extends React.Component {
  componentWillMount() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight(code) {
        /* eslint-disable max-len */
        const hljs = require('highlight.js/lib/highlight.js');
        hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
        hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
        return hljs.highlightAuto(code).value;
        /* eslint-enable max-len */
      },
    });
  }

  render() {
    const html = marked.parse(this.props.children);

    return (
      <div
        className={cx('markdown-body', this.props.className)}
        dangerouslySetInnerHTML={{__html: html}}
      />
    );
  }
}

export default Markdown;
