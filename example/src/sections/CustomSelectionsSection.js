import React from 'react';

import CustomSelectionsExample from '../examples/CustomSelectionsExample';
/* eslint-disable import/no-unresolved, import/extensions */
import CustomSelectionsExampleCode from '!raw-loader!../examples/CustomSelectionsExample';
/* eslint-enable import/no-unresolved, import/extensions */

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

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
