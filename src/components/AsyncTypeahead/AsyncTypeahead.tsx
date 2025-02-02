import React, { forwardRef } from 'react';

import { TypeaheadRef, useAsync, UseAsyncProps } from '../../core';

import Typeahead from '../Typeahead';

const AsyncTypeahead = forwardRef<TypeaheadRef, UseAsyncProps>((props, ref) => {
  return <Typeahead {...useAsync(props)} ref={ref} />;
});

export default AsyncTypeahead;
