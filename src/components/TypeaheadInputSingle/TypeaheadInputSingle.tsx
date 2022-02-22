import React from 'react';

import Hint from '../Hint';
import Input from '../Input';

import { TypeaheadInputProps } from '../../types';
import { propsWithBsClassName } from '../../utils';

const TypeaheadInputSingle = ({
  inputRef,
  referenceElementRef,
  ...props
}: TypeaheadInputProps) => (
  <Hint>
    <Input
      {...propsWithBsClassName(props)}
      ref={(node) => {
        inputRef(node);
        referenceElementRef(node);
      }}
    />
  </Hint>
);

export default TypeaheadInputSingle;
