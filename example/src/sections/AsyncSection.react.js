import React from 'react';

import AsyncExample from '../examples/AsyncExample.react';
import AsyncPaginationExample from '../examples/AsyncPaginationExample.react';

/* eslint-disable import/no-unresolved */
import AsyncExampleCode from '!raw-loader!../examples/AsyncExample.react';
import AsyncPaginationExampleCode from '!raw-loader!../examples/AsyncPaginationExample.react';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';
import Title from '../components/Title.react';

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
