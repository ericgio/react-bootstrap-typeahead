import cx from 'classnames';
import marked from 'marked';
import React from 'react';

const Markdown = React.createClass({
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
        return require('highlight.js').highlightAuto(code).value;
      },
    });
  },

  render() {
    const html = marked.parse(this.props.children);

    return (
      <div
        className={cx('markdown-body', this.props.className)}
        dangerouslySetInnerHTML={{__html: html}}
      />
    );
  },
});

export default Markdown;
