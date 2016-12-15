import React from 'react';

import LabelKeyExample from '../examples/LabelKeyExample.react';
import LabelKeyExampleCode from '!raw!../examples/LabelKeyExample.react';
import RenderingExample from '../examples/RenderingExample.react';
import RenderingExampleCode from '!raw!../examples/RenderingExample.react';

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';
import Title from '../components/Title.react';

const RenderingSection = props => (
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

RenderingSection.defaultProps = {
  title: 'Rendering',
};

export default RenderingSection;
