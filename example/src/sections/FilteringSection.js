import React from 'react';

import CustomFilteringExample from '../examples/CustomFilteringExample';
import FilteringExample from '../examples/FilteringExample';

/* eslint-disable import/no-unresolved */
import FilteringExampleCode from '!raw-loader!../examples/FilteringExample';
import CustomFilteringExampleCode from '!raw-loader!../examples/CustomFilteringExample';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';
import Title from '../components/Title';

const FilteringSection = (props) => (
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
