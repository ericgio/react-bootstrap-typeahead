// @flow

import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';
import useForceUpdate from '@restart/hooks/useForceUpdate';
import usePrevious from '@restart/hooks/usePrevious';

import type { ComponentType, ElementRef, Node } from 'react';

import Typeahead from '../core/Typeahead';

import { optionType } from '../propTypes';
import { getDisplayName, isFunction } from '../utils';

import type { Option, Ref, TypeaheadProps } from '../types';

const propTypes = {
  /**
   * Delay, in milliseconds, before performing search.
   */
  delay: PropTypes.number,
  /**
   * Whether or not a request is currently pending. Necessary for the
   * container to know when new results are available.
   */
  isLoading: PropTypes.bool.isRequired,
  /**
   * Number of input characters that must be entered before showing results.
   */
  minLength: PropTypes.number,
  /**
   * Callback to perform when the search is executed.
   */
  onSearch: PropTypes.func.isRequired,
  /**
   * Options to be passed to the typeahead. Will typically be the query
   * results, but can also be initial default options.
   */
  options: PropTypes.arrayOf(optionType),
  /**
   * Message displayed in the menu when there is no user input.
   */
  promptText: PropTypes.node,
  /**
   * Message displayed in the menu while the request is pending.
   */
  searchText: PropTypes.node,
  /**
   * Whether or not the component should cache query results.
   */
  useCache: PropTypes.bool,
};

const defaultProps = {
  delay: 200,
  minLength: 2,
  options: [],
  promptText: 'Type to search...',
  searchText: 'Searching...',
  useCache: true,
};

type Props = TypeaheadProps & {
  delay: number,
  emptyLabel: string,
  isLoading: boolean,
  onSearch: (string) => void,
  promptText: Node,
  searchText: Node,
  useCache: boolean,
};

type Cache = {
  [string]: Option[],
};

type DebouncedFunction = Function & {
  cancel: () => void,
};

/**
 * Logic that encapsulates common behavior and functionality around
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Optional query caching
 *  - Search prompt and empty results behaviors
 */
export function useAsync(props: * & Props) {
  const {
    allowNew,
    emptyLabel,
    isLoading,
    onSearch,
    options,
    promptText,
    searchText,
    useCache,
    ...otherProps
  } = props;

  const cacheRef: { current: Cache } = useRef({});
  const handleSearchDebouncedRef: Ref<DebouncedFunction> = useRef();
  const queryRef: { current: string } = useRef(props.defaultInputValue || '');

  const forceUpdate = useForceUpdate();
  const prevProps = usePrevious(props);

  const handleSearch = (query: string) => {
    queryRef.current = query;

    if (!query || (props.minLength && query.length < props.minLength)) {
      return;
    }

    // Use cached results, if applicable.
    if (useCache && cacheRef.current[query]) {
      // Re-render the component with the cached results.
      forceUpdate();
      return;
    }

    // Perform the search.
    onSearch(query);
  };

  // Set the debounced search function.
  useEffect(() => {
    handleSearchDebouncedRef.current = debounce(handleSearch, props.delay);
    return () => {
      handleSearchDebouncedRef.current &&
      handleSearchDebouncedRef.current.cancel();
    };
  });

  useEffect(() => {
    // Ensure that we've gone from a loading to a completed state. Otherwise
    // an empty response could get cached if the component updates during the
    // request (eg: if the parent re-renders for some reason).
    if (!isLoading && prevProps && prevProps.isLoading && useCache) {
      cacheRef.current[queryRef.current] = options;
    }
  });

  const getEmptyLabel = () => {
    if (!queryRef.current.length) {
      return promptText;
    }

    if (isLoading) {
      return searchText;
    }

    return emptyLabel;
  };

  const handleInputChange = (
    query: string,
    e: SyntheticEvent<HTMLInputElement>
  ) => {
    props.onInputChange && props.onInputChange(query, e);

    handleSearchDebouncedRef.current &&
    handleSearchDebouncedRef.current(query);
  };

  const cachedQuery = cacheRef.current[queryRef.current];

  return {
    ...otherProps,
    // Disable custom selections during a search if `allowNew` isn't a function.
    allowNew: isFunction(allowNew) ? allowNew : allowNew && !isLoading,
    emptyLabel: getEmptyLabel(),
    isLoading,
    onInputChange: handleInputChange,
    options: useCache && cachedQuery ? cachedQuery : options,
  };
}

export default function asyncContainer(Component: ComponentType<*>) {
  const AsyncTypeahead = forwardRef<* & Props, ElementRef<typeof Typeahead>>(
    (props, ref) => <Component {...useAsync(props)} ref={ref} />
  );

  AsyncTypeahead.displayName = `asyncContainer(${getDisplayName(Component)})`;
  // $FlowFixMe
  AsyncTypeahead.propTypes = propTypes;
  // $FlowFixMe
  AsyncTypeahead.defaultProps = defaultProps;

  return AsyncTypeahead;
}
