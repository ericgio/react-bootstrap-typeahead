import React from 'react';

import CustomSelectionsExample from '../examples/CustomSelectionsExample.react';
/* eslint-disable import/no-unresolved */
import CustomSelectionsExampleCode from '!raw-loader!../examples/CustomSelectionsExample.react';
/* eslint-enable import/no-unresolved */

import ExampleSection from '../components/ExampleSection.react';
import Markdown from '../components/Markdown.react';
import Section from '../components/Section.react';

const CustomSelections = (props) => (
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
