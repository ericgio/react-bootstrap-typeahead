import React from 'react';

import CustomFilteringExample from '../examples/CustomFilteringExample.react';
import CustomFilteringExampleCode from '!raw!../examples/CustomFilteringExample.react';
import FilteringExample from '../examples/FilteringExample.react';
import FilteringExampleCode from '!raw!../examples/FilteringExample.react';

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';
import Title from '../components/Title.react';

const FilteringSection = props => (
  <Section title={props.title}>
    <Markdown>
      By default, the typeahead is not case-sensitive and ignores diacritical
      marks when filtering. You can change these behaviors using the
      `caseSensitive` and `ignoreDiacritics` props.
    </Markdown>
    <ExampleSection code={FilteringExampleCode}>
      <FilteringExample />
    </ExampleSection>
    <Title>Custom Filtering</Title>
    <Markdown>
      Using the `filterBy` prop, you can either specify your own callback or an
      array of fields on your data object by which to filter.
    </Markdown>
    <ExampleSection code={CustomFilteringExampleCode}>
      <CustomFilteringExample />
    </ExampleSection>
  </Section>
);

FilteringSection.defaultProps = {
  title: 'Filtering',
};

export default FilteringSection;
