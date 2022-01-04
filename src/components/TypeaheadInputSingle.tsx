import React from 'react';

import Hint from './Hint';
import Input from './Input';

import withClassNames from '../behaviors/classNames';
import { TypeaheadInputProps } from '../types';

export default withClassNames(
  ({
    inputRef,
    referenceElementRef,
    shouldSelectHint,
    ...props
  }: TypeaheadInputProps) => (
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
