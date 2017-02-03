import React from 'react';

import BasicBehaviorsExample from '../examples/BasicBehaviorsExample';
import BasicBehaviorsExampleCode from '!raw!../examples/BasicBehaviorsExample';
import BodyContainerExample from '../examples/BodyContainerExample';
import BodyContainerExampleCode from '!raw!../examples/BodyContainerExample';
import InputSizeExample from '../examples/InputSizeExample';
import InputSizeExampleCode from '!raw!../examples/InputSizeExample';
import MenuAlignExample from '../examples/MenuAlignExample';
import MenuAlignExampleCode from '!raw!../examples/MenuAlignExample';
import PaginationExample from '../examples/PaginationExample';
import PaginationExampleCode from '!raw!../examples/PaginationExample';
import SelectionsExample from '../examples/SelectionsExample';
import SelectionsExampleCode from '!raw!../examples/SelectionsExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';
import Title from '../components/Title';

const BehaviorsSection = props => (
  <Section title={props.title}>
    <Markdown>
      The typeahead has several basic configurable behaviors. You can disable it
      as you would any input. You can also position the menu above the input
      with `dropup` or require minimum user input with `minLength`.
    </Markdown>
    <ExampleSection code={BasicBehaviorsExampleCode}>
      <BasicBehaviorsExample />
    </ExampleSection>
    <Title>Controlling Selections</Title>
    <Markdown>
      You can pre-populate the the typeahead by passing in an array of
      selections. Setting the `clearButton` prop displays a button allowing
      users to clear the input.
    </Markdown>
    <ExampleSection code={SelectionsExampleCode}>
      <SelectionsExample />
    </ExampleSection>
    <Title>Input Size</Title>
    <Markdown>
      Besides the default input size, you can specify either a `small` or
      `large` size using the `bsSize` prop.
    </Markdown>
    <ExampleSection code={InputSizeExampleCode}>
      <InputSizeExample />
    </ExampleSection>
    <Title>Menu Alignment</Title>
    <Markdown>
      Specify alignment of the menu via the `align` prop. Valid values
      are `justify`, `left`, or `right`.
    </Markdown>
    <ExampleSection code={MenuAlignExampleCode}>
      <MenuAlignExample />
    </ExampleSection>
    <Title>Pagination</Title>
    <Markdown>
      To improve browser performance, the typeahead paginates large data sets
      by default. You can set the number of results to be displayed using
      `maxResults`, or override pagination completely using `paginate`.
    </Markdown>
    <ExampleSection code={PaginationExampleCode}>
      <PaginationExample />
    </ExampleSection>
    <Title>Body Container</Title>
    <Markdown>
      Setting the `bodyContainer` prop will attach the menu to `document.body`
      instead of the typeahead. Compare the behaviors in the srolling container
      below.
    </Markdown>
    <ExampleSection code={BodyContainerExampleCode}>
      <BodyContainerExample />
    </ExampleSection>
  </Section>
);

BehaviorsSection.defaultProps = {
  title: 'Behaviors',
};

export default BehaviorsSection;
