import React, { forwardRef } from 'react';

import { TypeaheadRef } from '../../core';
import { useAsync, UseAsyncProps } from '../../hooks';

import Typeahead from '../Typeahead';

const AsyncTypeahead = forwardRef<TypeaheadRef, UseAsyncProps>((props, ref) => {
  return <Typeahead {...useAsync(props)} ref={ref} />;
});

export default AsyncTypeahead;
