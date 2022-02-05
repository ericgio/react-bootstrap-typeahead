import React from 'react';

import BasicBehaviorsExample from '../examples/BasicBehaviorsExample';
import FormExample from '../examples/FormExample';
import InputSizeExample from '../examples/InputSizeExample';
import MenuAlignExample from '../examples/MenuAlignExample';
import PaginationExample from '../examples/PaginationExample';
import PositionFixedExample from '../examples/PositionFixedExample';
import SelectionsExample from '../examples/SelectionsExample';

/* eslint-disable import/no-unresolved */
import BasicBehaviorsExampleCode from '!raw-loader!../examples/BasicBehaviorsExample';
import FormExampleCode from '!raw-loader!../examples/FormExample';
import InputSizeExampleCode from '!raw-loader!../examples/InputSizeExample';
import MenuAlignExampleCode from '!raw-loader!../examples/MenuAlignExample';
import PaginationExampleCode from '!raw-loader!../examples/PaginationExample';
import PositionFixedExampleCode from '!raw-loader!../examples/PositionFixedExample';
import SelectionsExampleCode from '!raw-loader!../examples/SelectionsExample';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';
import Title from '../components/Title';

const BehaviorsSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      The typeahead has several basic configurable behaviors. You can `disable`
      it as you would any input. You can position the menu above the input with
      `dropup` or automatically re-position it when it hits the viewport bounds.
      Use `minLength` to require a minimum user input before displaying results.
    </Markdown>
    <ExampleSection code={BasicBehaviorsExampleCode}>
      <BasicBehaviorsExample />
    </ExampleSection>
    <Title>Controlling Selections</Title>
    <Markdown>
      You can pre-populate the typeahead by passing in an array of selections.
      Setting the `clearButton` prop displays a button allowing users to clear
      the input.
    </Markdown>
    <ExampleSection code={SelectionsExampleCode}>
      <SelectionsExample />
    </ExampleSection>
    <Title>Input Size</Title>
    <Markdown>
      Besides the default input size, you can specify either a `sm` or `lg` size
      using the `size` prop.
    </Markdown>
    <ExampleSection code={InputSizeExampleCode}>
      <InputSizeExample />
    </ExampleSection>
    <Title>Menu Alignment</Title>
    <Markdown>
      Specify alignment of the menu via the `align` prop. Valid values are
      `justify`, `left`, or `right`.
    </Markdown>
    <ExampleSection code={MenuAlignExampleCode}>
      <MenuAlignExample />
    </ExampleSection>
    <Title>Input Groups and Validation States</Title>
    <Markdown>
      The typeahead works with Bootstrap input groups and add-ons; it also
      handles validation states.
    </Markdown>
    <ExampleSection code={FormExampleCode}>
      <FormExample />
    </ExampleSection>
    <Title>Pagination</Title>
    <Markdown>
      To improve browser performance, the typeahead paginates large data sets by
      default. You can set the number of results to be displayed using
      `maxResults`, or override pagination completely using `paginate`. The
      `onPaginate` hook allows you to respond to the pagination event.
    </Markdown>
    <ExampleSection code={PaginationExampleCode}>
      <PaginationExample />
    </ExampleSection>
    <Title>Positioning</Title>
    <Markdown>
      Setting the `positionFixed` prop will position the menu using fixed
      instead of absolute positioning. This is useful when a parent container
      has `overflow: hidden` set.
    </Markdown>
    <ExampleSection code={PositionFixedExampleCode}>
      <PositionFixedExample />
    </ExampleSection>
  </Section>
);

BehaviorsSection.defaultProps = {
  title: 'Behaviors',
};

export default BehaviorsSection;
