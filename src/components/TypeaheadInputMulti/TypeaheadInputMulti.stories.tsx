import React, { ChangeEvent, useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';

import Token from '../Token';
import TypeaheadInputMulti, {
  TypeaheadInputMultiProps,
} from './TypeaheadInputMulti';

import options from '../../tests/data';
import { HintProvider, noop } from '../../tests/helpers';
import type { Size } from '../../types';

export default {
  title: 'Components/TypeaheadInputMulti',
  component: TypeaheadInputMulti,
} as Meta;

const selected = options.slice(1, 4);

const defaultProps = {
  children: selected.map((option) => (
    <Token key={option.name} option={option} onRemove={noop}>
      {option.name}
    </Token>
  )),
  selected,
};

interface Args extends TypeaheadInputMultiProps {
  hintText?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  size?: Size;
}

const Template: StoryFn<Args> = ({ hintText = '', ...args }) => {
  const [value, setValue] = useState(args.value);
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null);

  return (
    <HintProvider hintText={hintText} inputNode={inputNode}>
      <TypeaheadInputMulti
        {...args}
        inputRef={setInputNode}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        referenceElementRef={noop}
        value={value}
      />
    </HintProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const FocusState = Template.bind({});
FocusState.args = {
  ...defaultProps,
  className: 'focus',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultProps,
  children: selected.map((option) => (
    <Token disabled key={option.name} option={option} onRemove={noop}>
      {option.name}
    </Token>
  )),
  disabled: true,
};

export const Small = Template.bind({});
Small.args = {
  ...defaultProps,
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  ...defaultProps,
  size: 'lg',
};

export const Valid = Template.bind({});
Valid.args = {
  ...defaultProps,
  className: 'focus',
  isValid: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...defaultProps,
  className: 'focus',
  isInvalid: true,
};

export const WithHint = Template.bind({});
WithHint.args = {
  ...defaultProps,
  hintText: 'california',
  value: 'cali',
};
