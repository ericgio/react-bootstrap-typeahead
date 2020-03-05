// @flow

import React from 'react';

import Input from './Input.react';

import hintContainer from '../containers/hintContainer';
import withClassNames from '../containers/withClassNames';

import type { KeyboardEventHandler, RefCallback } from '../types';

type Props = {
  inputRef: RefCallback<HTMLInputElement>,
  onKeyDown: KeyboardEventHandler<HTMLInputElement>,
};

const HintedInput = hintContainer(Input);

export default withClassNames(({ inputRef, ...props }: Props) => (
  <HintedInput {...props} ref={inputRef} />
));
