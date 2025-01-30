import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';

import TypeaheadInputSingle from './TypeaheadInputSingle';

import type { Size, TypeaheadInputProps } from '../../types';
import { HintProvider, noop } from '../../tests/helpers';

export default {
  title: 'Components/TypeaheadInputSingle',
  component: TypeaheadInputSingle,
} as Meta;

interface Args extends Omit<TypeaheadInputProps, 'size'> {
  hintText?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: Size;
}

const Template: StoryFn<Args> = ({ hintText = '', ...args }) => {
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null);

  return (
    <HintProvider hintText={hintText} inputNode={inputNode}>
      <TypeaheadInputSingle
        {...args}
        inputRef={setInputNode}
        referenceElementRef={noop}
      />
    </HintProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'This is a default input...',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  placeholder: 'This is a disabled input...',
};

export const Small = Template.bind({});
Small.args = {
  placeholder: 'This is a small input...',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  placeholder: 'This is a large input...',
  size: 'lg',
};

export const Valid = Template.bind({});
Valid.args = {
  placeholder: 'This is a valid input...',
  isValid: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  placeholder: 'This is an invalid input...',
  isInvalid: true,
};

export const WithHint = Template.bind({});
WithHint.args = {
  hintText: 'California',
  onChange: noop,
  value: 'Ca',
};
