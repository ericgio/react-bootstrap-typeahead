// @flow

import React from 'react';

import Hint, { type ShouldSelect } from './Hint.react';
import Input from './Input.react';

import withClassNames from '../containers/withClassNames';

import type { RefCallback, ReferenceElement } from '../types';

type Props = {
  inputRef: RefCallback<HTMLInputElement>,
  referenceElementRef: RefCallback<ReferenceElement>,
  shouldSelectHint?: ShouldSelect,
};

export default withClassNames(({
  inputRef,
  referenceElementRef,
  shouldSelectHint,
  ...props
}: Props) => (
  <Hint shouldSelect={shouldSelectHint}>
    <Input
      {...props}
      ref={(node) => {
        inputRef(node);
        referenceElementRef(node);
      }}
    />
  </Hint>
));
