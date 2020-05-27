import React from 'react';

import BasicBehaviorsExample from '../examples/BasicBehaviorsExample.react';
import FormExample from '../examples/FormExample.react';
import InputSizeExample from '../examples/InputSizeExample.react';
import MenuAlignExample from '../examples/MenuAlignExample.react';
import PaginationExample from '../examples/PaginationExample.react';
import PositionFixedExample from '../examples/PositionFixedExample.react';
import SelectionsExample from '../examples/SelectionsExample.react';

/* eslint-disable import/no-unresolved */
import BasicBehaviorsExampleCode from '!raw-loader!../examples/BasicBehaviorsExample.react';
import FormExampleCode from '!raw-loader!../examples/FormExample.react';
import InputSizeExampleCode from '!raw-loader!../examples/InputSizeExample.react';
import MenuAlignExampleCode from '!raw-loader!../examples/MenuAlignExample.react';
import PaginationExampleCode from '!raw-loader!../examples/PaginationExample.react';
import PositionFixedExampleCode from '!raw-loader!../examples/PositionFixedExample.react';
import SelectionsExampleCode from '!raw-loader!../examples/SelectionsExample.react';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';
import Title from '../components/Title.react';

const BehaviorsSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      The typeahead has several basic configurable behaviors. You can `disable`
      it as you would any input. You can position the menu above the input
      with `dropup` or automatically re-position it when it hits the viewport
      bounds. Use `minLength` to require a minimum user input before displaying
      results.
    </Markdown>
    <ExampleSection code={BasicBehaviorsExampleCode}>
      <BasicBehaviorsExample />
    </ExampleSection>
    <Title>Controlling Selections</Title>
    <Markdown>
      You can pre-populate the typeahead by passing in an array of
      selections. Setting the `clearButton` prop displays a button allowing
      users to clear the input.
    </Markdown>
    <ExampleSection code={SelectionsExampleCode}>
      <SelectionsExample />
    </ExampleSection>
    <Title>Input Size</Title>
    <Markdown>
      Besides the default input size, you can specify either a `small` or
      `large` size using the `size` prop.
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
    <Title>Input Groups and Validation States</Title>
    <Markdown>
      The typeahead works with Bootstrap input groups and add-ons; it
      also handles validation states.
    </Markdown>
    <ExampleSection code={FormExampleCode}>
      <FormExample />
    </ExampleSection>
    <Title>Pagination</Title>
    <Markdown>
      To improve browser performance, the typeahead paginates large data sets
      by default. You can set the number of results to be displayed using
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
