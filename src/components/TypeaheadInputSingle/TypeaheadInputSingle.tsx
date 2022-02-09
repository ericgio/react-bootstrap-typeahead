import React from 'react';

import Hint from '../Hint';
import Input from '../Input';

import withClassNames from '../../behaviors/classNames';
import { TypeaheadInputProps } from '../../types';

const TypeaheadInputSingle = ({
  inputRef,
  referenceElementRef,
  ...props
}: TypeaheadInputProps) => (
  <Hint>
    <Input
      {...props}
      ref={(node) => {
        inputRef(node);
        referenceElementRef(node);
      }}
    />
  </Hint>
);

export default withClassNames(TypeaheadInputSingle);
