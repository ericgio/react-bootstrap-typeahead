import React, { forwardRef, ReactNode } from 'react';

import { TypeaheadRef } from '../../core';
import { useAsync, UseAsyncProps } from '../../hooks';

import Typeahead, { TypeaheadComponentProps } from '../Typeahead';

export interface AsyncTypeaheadProps
  extends UseAsyncProps,
    Omit<TypeaheadComponentProps, 'isLoading'> {
  /**
   * Message displayed in the menu when there is no user input.
   */
  promptText?: ReactNode;
  /**
   * Message displayed in the menu while the request is pending.
   */
  searchText?: ReactNode;
}

const AsyncTypeahead = forwardRef<TypeaheadRef, AsyncTypeaheadProps>(
  (props, ref) => {
    const {
      emptyLabel,
      isLoading,
      promptText = 'Type to search...',
      searchText = 'Searching...',
    } = props;

    const { query, ...asyncProps } = useAsync(props);

    function getEmptyLabel() {
      if (!query.length) {
        return promptText;
      }

      if (isLoading) {
        return searchText;
      }

      return emptyLabel;
    }

    return (
      <Typeahead
        {...props}
        {...asyncProps}
        emptyLabel={getEmptyLabel()}
        ref={ref}
      />
    );
  }
);

export default AsyncTypeahead;
