import React from 'react';

import CustomSelectionsExample from '../examples/CustomSelectionsExample.react';
import CustomSelectionsExampleCode from '!raw!../examples/CustomSelectionsExample.react';

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';

const CustomSelections = props => (
  <Section title={props.title}>
    <Markdown>
      Setting the `allowNew` prop provides the ability to create new options for
      the data set. You can change the label displayed before the custom option
      in the menu by using the `newSelectionPrefix` prop.
    </Markdown>
    <ExampleSection code={CustomSelectionsExampleCode}>
      <CustomSelectionsExample />
    </ExampleSection>
  </Section>
);

CustomSelections.defaultProps = {
  title: 'Custom Selections',
};

export default CustomSelections;
