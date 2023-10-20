import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, {
  ChangeEvent,
  ComponentType,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import useForceUpdate from '@restart/hooks/useForceUpdate';
import usePrevious from '@restart/hooks/usePrevious';

import Typeahead from '../core/Typeahead';

import { optionType } from '../propTypes';
import { getDisplayName, isFunction, warn } from '../utils';

import { TypeaheadComponentProps } from '../components/Typeahead';
import type { Option } from '../types';

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

export interface UseAsyncProps extends TypeaheadComponentProps {
  delay?: number;
  isLoading: boolean;
  onSearch: (query: string) => void;
  promptText?: ReactNode;
  searchText?: ReactNode;
  useCache?: boolean;
}

type Cache = Record<string, Option[]>;

type DebouncedFn<T> = T & {
  cancel: () => void;
};

/**
 * Logic that encapsulates common behavior and functionality around
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Optional query caching
 *  - Search prompt and empty results behaviors
 */
export function useAsync(props: UseAsyncProps) {
  const {
    allowNew,
    delay = 200,
    emptyLabel,
    isLoading,
    minLength = 2,
    onInputChange,
    onSearch,
    options = [],
    promptText = 'Type to search...',
    searchText = 'Searching...',
    useCache = true,
    ...otherProps
  } = props;

  const cacheRef = useRef<Cache>({});
  const handleSearchDebouncedRef = useRef<DebouncedFn<
    typeof handleSearch
  > | null>(null);
  const queryRef = useRef<string>(props.defaultInputValue || '');

  const forceUpdate = useForceUpdate();
  const prevProps = usePrevious(props);

  const handleSearch = useCallback(
    (query: string) => {
      queryRef.current = query;

      if (!query || (minLength && query.length < minLength)) {
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
    },
    [forceUpdate, minLength, onSearch, useCache]
  );

  // Set the debounced search function.
  useEffect(() => {
    handleSearchDebouncedRef.current = debounce(handleSearch, delay);
    return () => {
      handleSearchDebouncedRef.current &&
        handleSearchDebouncedRef.current.cancel();
    };
  }, [delay, handleSearch]);

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

  const handleInputChange = useCallback(
    (query: string, e: ChangeEvent<HTMLInputElement>) => {
      onInputChange && onInputChange(query, e);

      handleSearchDebouncedRef.current &&
        handleSearchDebouncedRef.current(query);
    },
    [onInputChange]
  );

  const cachedQuery = cacheRef.current[queryRef.current];

  return {
    ...otherProps,
    // Disable custom selections during a search if `allowNew` isn't a function.
    allowNew: isFunction(allowNew) ? allowNew : allowNew && !isLoading,
    emptyLabel: getEmptyLabel(),
    isLoading,
    minLength,
    onInputChange: handleInputChange,
    options: useCache && cachedQuery ? cachedQuery : options,
  };
}

/* istanbul ignore next */
export function withAsync<T extends UseAsyncProps = UseAsyncProps>(
  Component: ComponentType<T>
) {
  warn(
    false,
    'Warning: `withAsync` is deprecated and will be removed in the next ' +
      'major version. Use `useAsync` instead.'
  );

  const AsyncTypeahead = forwardRef<Typeahead, T>((props, ref) => (
    <Component {...props} {...useAsync(props)} ref={ref} />
  ));

  AsyncTypeahead.displayName = `withAsync(${getDisplayName(Component)})`;
  // @ts-ignore
  AsyncTypeahead.propTypes = propTypes;

  return AsyncTypeahead;
}
