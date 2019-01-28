/* global Prism */
/* eslint-disable react/no-danger,import/no-extraneous-dependencies */

import cx from 'classnames';
import marked from 'marked';
import React from 'react';

class Markdown extends React.Component {
  componentDidMount() {
    marked.setOptions({
      breaks: true,
      gfm: true,
      highlight: (code) => Prism.highlight(code, Prism.languages.markdown),
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      tables: true,
    });
  }

  render() {
    const {children, className} = this.props;

    return (
      <div
        className={cx('markdown-body', className)}
        dangerouslySetInnerHTML={{__html: marked.parse(children)}}
      />
    );
  }
}

export default Markdown;
