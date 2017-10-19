import React from 'react';

import AsyncExample from '../examples/AsyncExample';
import AsyncExampleCode from '!raw-loader!../examples/AsyncExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const AsyncSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      You can use the `AsyncTypeahead` component for asynchronous searches. It
      debounces user input, sets the `isLoading` prop depending on whether the
      request is pending, and includes a simple query cache to avoid making the
      same request more than once.
    </Markdown>
    <ExampleSection code={AsyncExampleCode}>
      <AsyncExample />
    </ExampleSection>
  </Section>
);

AsyncSection.defaultProps = {
  title: 'Asynchronous Searching',
};

export default AsyncSection;
