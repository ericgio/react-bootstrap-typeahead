import React, { ReactNode } from 'react';

interface AnchorProps {
  children: ReactNode;
  id: string;
}

const Anchor = ({ children, id }: AnchorProps) => (
  <>
    <span className="page-anchor" id={id} />
    <a className="anchor" href={`#${id}`}>
      <span className="anchor-icon">#</span>
      {children}
    </a>
  </>
);

export default Anchor;
