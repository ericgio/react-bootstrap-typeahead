import React from 'react';

import BasicExample from '../examples/BasicExample';
import BasicExampleCode from '!raw-loader!../examples/BasicExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

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
