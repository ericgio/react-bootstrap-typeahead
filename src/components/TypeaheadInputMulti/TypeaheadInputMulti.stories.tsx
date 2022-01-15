/* eslint-disable sort-keys,import/no-extraneous-dependencies */

import React, { ChangeEvent, useState } from 'react';
import { Story, Meta } from '@storybook/react';

import Token from '../Token';
import TypeaheadInputMulti, {
  TypeaheadInputMultiProps,
} from './TypeaheadInputMulti';

import options from '../../tests/data';
import { HintProvider, noop } from '../../tests/helpers';

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
}

const Template: Story<Args> = ({ hintText = '', ...args }) => {
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

export const WithHint = Template.bind({});
WithHint.args = {
  ...defaultProps,
  hintText: 'california',
  value: 'cali',
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
