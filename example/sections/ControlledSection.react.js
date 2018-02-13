import React from 'react';

import ControlledExample from '../examples/ControlledExample';
import ControlledExampleCode from '!raw-loader!../examples/ControlledExample';

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const ControlledSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      This example shows how to use the selected props to control the typeahead component with external state.
    </Markdown>
    <ExampleSection code={ControlledExampleCode}>
      <ControlledExample />
    </ExampleSection>
  </Section>
);

ControlledSection.defaultProps = {
  title: 'Controlled Example',
};

export default ControlledSection;
