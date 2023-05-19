import React, { forwardRef, ReactElement, Ref } from 'react';
import { useAsync, UseAsyncProps } from '../../behaviors/async';
import TypeaheadComponent from '../Typeahead';
import Typeahead from '../../core/Typeahead';
import { OptionType } from "../../types";

// Generics are handled with `as` casting
const AsyncTypeahead = forwardRef<Typeahead<OptionType>, UseAsyncProps<OptionType>>((props, ref) => (
  <TypeaheadComponent {...useAsync(props)} ref={ref} />
))  as <Option extends OptionType>(p: UseAsyncProps<Option> & { ref?: Ref<Typeahead<Option>> }) => ReactElement;

export default AsyncTypeahead;
