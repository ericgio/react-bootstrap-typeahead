// @flow

import React from 'react';

import Hint from './Hint.react';
import Input from './Input.react';

import withClassNames from '../containers/withClassNames';

import type { KeyboardEventHandler, RefCallback } from '../types';

type Props = {
  inputRef: RefCallback<HTMLInputElement>,
  onKeyDown: KeyboardEventHandler<HTMLInputElement>,
};

export default withClassNames(({ inputRef, ...props }: Props) => (
  <Hint>
    <Input {...props} ref={inputRef} />
  </Hint>
));
