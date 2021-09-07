import React from 'react';

const Anchor = ({ children, id }) => (
  <>
    <span className="page-anchor" id={id} />
    <a className="anchor" href={`#${id}`}>
      <span className="anchor-icon">#</span>
      {children}
    </a>
  </>
);

export default Anchor;
