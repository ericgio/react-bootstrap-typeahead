import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { optionType } from '../propTypes';
import { getDisplayName } from '../utils';

const DEFAULT_DELAY_MS = 200;

/**
 * HoC that encapsulates common behavior and functionality for doing
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Optional query caching
 *  - Search prompt and empty results behaviors
 */
const asyncContainer = (Typeahead) => {
  class WrappedTypeahead extends React.Component {
    _cache = {};
    _query = this.props.defaultInputValue || '';

    componentDidMount() {
      this._handleSearchDebounced = debounce(
        this._handleSearch,
        this.props.delay
      );
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.isLoading && this.props.useCache) {
        this._cache[this._query] = this.props.options;
      }
    }

    componentWillUnmount() {
      this._cache = {};
      this._query = '';
      this._handleSearchDebounced.cancel();
    }

    render() {
      const { options, useCache, ...props } = this.props;
      const cachedQuery = this._cache[this._query];

      // Disable custom selections during a search unless `allowNew` is a
      // function.
      const allowNew = typeof props.allowNew === 'function' ?
        props.allowNew :
        props.allowNew && !props.isLoading;

      return (
        <Typeahead
          {...props}
          allowNew={allowNew}
          emptyLabel={this._getEmptyLabel()}
          onInputChange={this._handleInputChange}
          options={useCache && cachedQuery ? cachedQuery : options}
          ref={(instance) => this._instance = instance}
        />
      );
    }

    /**
     * Make the component instance available.
     */
    getInstance() {
      return this._instance.getInstance();
    }

    _getEmptyLabel = () => {
      const {
        emptyLabel,
        isLoading,
        promptText,
        searchText,
      } = this.props;

      if (!this._query.length) {
        return promptText;
      }

      if (isLoading) {
        return searchText;
      }

      return emptyLabel;
    }

    _handleInputChange = (query, e) => {
      this.props.onInputChange && this.props.onInputChange(query, e);
      this._handleSearchDebounced(query);
    }

    _handleSearch = (query) => {
      this._query = query;

      const { minLength, onSearch, useCache } = this.props;

      if (!query || (minLength && query.length < minLength)) {
        return;
      }

      // Use cached results, if applicable.
      if (useCache && this._cache[query]) {
        // Re-render the component with the cached results.
        this.forceUpdate();
        return;
      }

      // Perform the search.
      onSearch(query);
    }
  }

  WrappedTypeahead.displayName = `AsyncContainer(${getDisplayName(Typeahead)})`;

  WrappedTypeahead.propTypes = {
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
    options: optionType,
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

  WrappedTypeahead.defaultProps = {
    delay: DEFAULT_DELAY_MS,
    minLength: 2,
    options: [],
    promptText: 'Type to search...',
    searchText: 'Searching...',
    useCache: true,
  };

  return WrappedTypeahead;
};

export default asyncContainer;
