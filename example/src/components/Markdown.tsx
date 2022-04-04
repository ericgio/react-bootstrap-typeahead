import { marked } from 'marked';
import React from 'react';

marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
  smartLists: true,
  smartypants: false,
});

interface MarkdownProps {
  children: string;
}

const Markdown = ({ children }: MarkdownProps) => (
  <div
    className="markdown-body"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: marked.parse(children) }}
  />
);

export default Markdown;
