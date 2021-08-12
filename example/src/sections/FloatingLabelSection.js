import React from 'react';

import FloatingLabelExample from '../examples/FloatingLabelExample';
/* eslint-disable import/no-unresolved, import/extensions */
import FloatingLabelCode from '!raw-loader!../examples/FloatingLabelExample';
/* eslint-enable import/no-unresolved, import/extensions */

import ExampleSection from '../components/ExampleSection';
import Markdown from '../components/Markdown';
import Section from '../components/Section';

const FloatingLabelSection = (props) => (
  <Section title={props.title}>
    <Markdown>
      When using Bootstrap 5, pass a unique `id`, `floatingLabelText`, `useFloatingLabel: true` in the `inputProps` to enable floating labels. Bootstrap also requires a `placeholder`, `useFloatingLabel` will be used as a fallback if one is not provided and vice versa. If neither is provided the label will not react to focussing.
    </Markdown>
    <ExampleSection code={FloatingLabelCode}>
      <FloatingLabelExample />
    </ExampleSection>
  </Section>
);

FloatingLabelSection.defaultProps = {
  title: 'Floating Labels Example',
};

export default FloatingLabelSection;
