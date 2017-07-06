import React from 'react';

import PublicMethodsExample from '../examples/PublicMethodsExample';
import PublicMethodsExampleCode from '!raw-loader!../examples/PublicMethodsExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const PublicMethodsSection = props => (
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

PublicMethodsSection.defaultProps = {
  title: 'Public Methods',
};

export default PublicMethodsSection;
