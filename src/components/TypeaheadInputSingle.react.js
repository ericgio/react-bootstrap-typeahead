// @flow

import React from 'react';

import Input from './Input.react';

import hintContainer from '../containers/hintContainer';
import withClassNames from '../containers/withClassNames';

import type { InputRefHandler } from '../types';

type Props = {
  inputRef: InputRefHandler,
};

const HintedInput = hintContainer(Input);

export default withClassNames(({ inputRef, ...props }: Props) => (
  <HintedInput {...props} ref={inputRef} />
));
