/* eslint-disable import/no-unresolved */

import React from 'react';

import PublicMethodsExample from '../examples/PublicMethodsExample';
import PublicMethodsExampleCode from '!raw-loader!../examples/PublicMethodsExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

interface PublicMethodsSectionProps {
  title: string;
}

const PublicMethodsSection = (props: PublicMethodsSectionProps) => (
  <Section title={props.title}>
    <Markdown>
      The `clear`, `focus`, and `blur` methods are exposed for programmatic
      control of the typeahead.
    </Markdown>
    <ExampleSection code={PublicMethodsExampleCode}>
      <PublicMethodsExample />
    </ExampleSection>
  </Section>
);

export default PublicMethodsSection;
