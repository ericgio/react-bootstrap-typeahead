import React from 'react';

import BasicBehaviorsExample from '../examples/BasicBehaviorsExample.react';
import BodyContainerExample from '../examples/BodyContainerExample.react';
import FormExample from '../examples/FormExample.react';
import InputSizeExample from '../examples/InputSizeExample.react';
import MenuAlignExample from '../examples/MenuAlignExample.react';
import PaginationExample from '../examples/PaginationExample.react';
import SelectionsExample from '../examples/SelectionsExample.react';
import TokenFocusExample from '../examples/TokenFocusExample.react';

/* eslint-disable import/no-unresolved */
import BasicBehaviorsExampleCode from '!raw-loader!../examples/BasicBehaviorsExample.react';
import BodyContainerExampleCode from '!raw-loader!../examples/BodyContainerExample.react';
import FormExampleCode from '!raw-loader!../examples/FormExample.react';
import InputSizeExampleCode from '!raw-loader!../examples/InputSizeExample.react';
import MenuAlignExampleCode from '!raw-loader!../examples/MenuAlignExample.react';
import PaginationExampleCode from '!raw-loader!../examples/PaginationExample.react';
import SelectionsExampleCode from '!raw-loader!../examples/SelectionsExample.react';
import TokenFocusExampleCode from '!raw-loader!../examples/TokenFocusExample.react';
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
      results, or hide the menu when there are no results by passing an empty
      string to `emptyLabel`.
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
    <Title>Token focus</Title>
    <Markdown>
      You can react on tokens being focused, by setting the ```onTokenFocus```
       handler.
    </Markdown>
    <ExampleSection code={TokenFocusExampleCode}>
      <TokenFocusExample />
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
