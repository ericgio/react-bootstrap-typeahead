import React from 'react';

import BasicExample from '../examples/BasicExample.react';
import BasicExampleCode from '!raw!../examples/BasicExample.react';

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';

const BasicSection = props => (
  <Section title={props.title}>
    <Markdown>
      The typeahead allows single-selection by default. Setting the `multiple`
      prop turns the component into a tokenizer, allowing multiple selections.
    </Markdown>
    <ExampleSection code={BasicExampleCode}>
      <BasicExample />
    </ExampleSection>
  </Section>
);

BasicSection.defaultProps = {
  title: 'Basic Example',
};

export default BasicSection;
