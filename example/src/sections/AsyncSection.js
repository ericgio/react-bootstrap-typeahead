import React from 'react';

import AsyncExample from '../examples/AsyncExample';

/* eslint-disable import/no-unresolved, import/extensions */
import AsyncExampleCode from '!raw-loader!../examples/AsyncExample';
/* eslint-enable import/no-unresolved, import/extensions */

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const AsyncSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      You can use the `AsyncTypeahead` component for asynchronous searches. It
      debounces user input and includes an optional query cache to avoid making
      the same request more than once in basic cases.
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
