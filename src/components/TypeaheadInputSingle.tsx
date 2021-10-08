import React, { RefCallback } from 'react';

import Hint, { ShouldSelect } from './Hint';
import Input from './Input';

import withClassNames from '../behaviors/classNames';

interface TypeaheadInputSingleProps {
  inputRef: RefCallback<HTMLInputElement>;
  referenceElementRef: RefCallback<HTMLInputElement>;
  shouldSelectHint?: ShouldSelect;
}

export default withClassNames(
  ({
    inputRef,
    referenceElementRef,
    shouldSelectHint,
    ...props
  }: TypeaheadInputSingleProps) => (
    <Hint shouldSelect={shouldSelectHint}>
      <Input
        {...props}
        ref={(node) => {
          inputRef(node);
          referenceElementRef(node);
        }}
      />
    </Hint>
  )
);
