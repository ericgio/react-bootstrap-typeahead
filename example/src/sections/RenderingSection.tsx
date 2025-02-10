import React from 'react';

import LabelKeyExample from '../examples/LabelKeyExample';
import RenderingExample from '../examples/RenderingExample';

import LabelKeyExampleCode from '!raw-loader!../examples/LabelKeyExample';
import RenderingExampleCode from '!raw-loader!../examples/RenderingExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';
import Title from '../components/Title';

interface RenderingSectionProps {
  title: string;
}

const RenderingSection = (props: RenderingSectionProps) => (
  <Section title={props.title}>
    <Markdown>
      You can customize how the typeahead looks and behaves by using the
      provided rendering hooks.
    </Markdown>
    <ExampleSection code={RenderingExampleCode}>
      <RenderingExample />
    </ExampleSection>
    <Title>LabelKey</Title>
    <Markdown>
      The `labelKey` prop accepts a callback allowing you to transform your data
      and return a compound string rather than just a single data field.
    </Markdown>
    <ExampleSection code={LabelKeyExampleCode}>
      <LabelKeyExample />
    </ExampleSection>
  </Section>
);

export default RenderingSection;
