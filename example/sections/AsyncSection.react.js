import * as React from 'react';

import AsyncExample from '../examples/AsyncExample';
import AsyncExampleCode from '!raw-loader!../examples/AsyncExample';
import AsyncPaginationExample from '../examples/AsyncPaginationExample';
import AsyncPaginationExampleCode from '!raw-loader!../examples/AsyncPaginationExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';
import Title from '../components/Title';

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
    <Title>Pagination</Title>
    <Markdown>
      A more advanced case involves paginating async results. Additional results
      are fetched using `onPaginate` while a custom query cache tracks the
      incremental results and page number for each query.
    </Markdown>
    <ExampleSection code={AsyncPaginationExampleCode}>
      <AsyncPaginationExample />
    </ExampleSection>
  </Section>
);

AsyncSection.defaultProps = {
  title: 'Asynchronous Searching',
};

export default AsyncSection;
