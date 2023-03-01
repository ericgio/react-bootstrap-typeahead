import React, { useCallback } from 'react';

import Hint from '../Hint';
import Input from '../Input';

import { TypeaheadInputProps } from '../../types';
import { propsWithBsClassName } from '../../utils';

const TypeaheadInputSingle = ({
  inputRef,
  referenceElementRef,
  ...props
}: TypeaheadInputProps) => {
  const ref = useCallback(
    (node: HTMLInputElement) => {
      inputRef(node);
      referenceElementRef(node);
    },
    [inputRef, referenceElementRef]
  );

  return (
    <Hint>
      <Input {...propsWithBsClassName(props)} ref={ref} />
    </Hint>
  );
};

export default TypeaheadInputSingle;
