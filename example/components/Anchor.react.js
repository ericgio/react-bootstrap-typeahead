import * as React from 'react';

const Anchor = ({children, id}) => (
  <a
    className="anchor"
    href={`#${id}`}
    id={id}>
    <span className="anchor-icon">#</span>
    {children}
  </a>
);

export default Anchor;
