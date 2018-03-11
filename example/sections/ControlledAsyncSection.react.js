import React from 'react';

import ControlledExample from '../examples/ControlledAsyncExample';
import ControlledExampleCode from '!raw-loader!../examples/ControlledAsyncExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const ControlledAsyncSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      This example shows how to use the selected props to control the async typeahead component with external state.
    </Markdown>
    <ExampleSection code={ControlledExampleCode}>
      <ControlledExample />
    </ExampleSection>
  </Section>
);

ControlledAsyncSection.defaultProps = {
  title: 'Controlled Async Example',
};

export default ControlledAsyncSection;
