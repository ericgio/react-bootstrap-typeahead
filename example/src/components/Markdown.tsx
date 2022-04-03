import cx from 'classnames';
import { marked } from 'marked';
import React from 'react';

marked.setOptions({
  breaks: true,
  gfm: true,
  // @ts-ignore: Global
  highlight: (code) => Prism.highlight(code, Prism.languages.markdown),
  pedantic: false,
  smartLists: true,
  smartypants: false,
});

interface MarkdownProps {
  children: string;
  className?: string;
}

const Markdown = ({ children, className }: MarkdownProps) => (
  <div
    className={cx('markdown-body', className)}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: marked.parse(children) }}
  />
);

export default Markdown;
