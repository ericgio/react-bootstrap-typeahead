import React, { forwardRef } from 'react';
import { useAsync, UseAsyncProps } from '../../behaviors/async';
import TypeaheadComponent from '../Typeahead';
import Typeahead from '../../core/Typeahead';

const AsyncTypeahead = forwardRef<Typeahead, UseAsyncProps>((props, ref) => (
  <TypeaheadComponent {...useAsync(props)} ref={ref} />
));

export default AsyncTypeahead;
