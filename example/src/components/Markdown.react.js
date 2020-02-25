/* global Prism */
/* eslint-disable react/no-danger,import/no-extraneous-dependencies */

import cx from 'classnames';
import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';

marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: (code) => Prism.highlight(code, Prism.languages.markdown),
  pedantic: false,
  smartLists: true,
  smartypants: false,
  tables: true,
});

const Markdown = ({ children, className }) => (
  <div
    className={cx('markdown-body', className)}
    dangerouslySetInnerHTML={{ __html: marked.parse(children) }}
  />
);

Markdown.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Markdown;
