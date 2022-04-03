import React from 'react';

import Anchor from './Anchor';
import { useExampleContext } from './Context';
import ScrollSpy from './ScrollSpy';

import getIdFromTitle from '../util/getIdFromTitle';

interface SectionProps {
  children: React.ReactNode;
  title: string;
}

const Section = ({ children, title }: SectionProps) => {
  const { onAfter, onBefore } = useExampleContext();
  const id = getIdFromTitle(title);

  return (
    <section className="section">
      <ScrollSpy href={`#${id}`} onAfter={onAfter} onBefore={onBefore} />
      <h1 className="page-header">
        <Anchor id={id}>{title}</Anchor>
      </h1>
      {children}
    </section>
  );
};

export default Section;
