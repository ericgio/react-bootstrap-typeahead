import React from 'react';

import BasicExample from '../examples/BasicExample.react';
/* eslint-disable import/no-unresolved */
import BasicExampleCode from '!raw-loader!../examples/BasicExample.react';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';

const BasicSection = (props) => (
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
