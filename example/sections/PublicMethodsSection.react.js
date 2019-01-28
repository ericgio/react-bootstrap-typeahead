import React from 'react';

import PublicMethodsExample from '../examples/PublicMethodsExample.react';
/* eslint-disable import/no-unresolved */
import PublicMethodsExampleCode from '!raw-loader!../examples/PublicMethodsExample.react';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';

const PublicMethodsSection = (props) => (
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
