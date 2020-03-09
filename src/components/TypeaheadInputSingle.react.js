// @flow

import React from 'react';

import Hint from './Hint.react';
import Input from './Input.react';

import withClassNames from '../containers/withClassNames';

import type { KeyboardEventHandler, RefCallback, ReferenceElement } from '../types';

type Props = {
  inputRef: RefCallback<HTMLInputElement>,
  onKeyDown: KeyboardEventHandler<HTMLInputElement>,
  referenceElementRef: RefCallback<ReferenceElement>,
};

export default withClassNames(({
  inputRef,
  referenceElementRef,
  ...props
}: Props) => (
  <Hint>
    <Input
      {...props}
      ref={(node) => {
        inputRef(node);
        referenceElementRef(node);
      }}
    />
  </Hint>
));
