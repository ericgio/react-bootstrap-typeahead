import {debounce} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName} from '../utils/';

const DEFAULT_DELAY_MS = 200;

/**
 * HoC that encapsulates common behavior and functionality for doing
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Query caching (optional)
 *  - Search prompt and empty results behaviors
 */
const asyncContainer = (Typeahead) => {
  class WrappedTypeahead extends React.Component {
    state = {
      query: '',
    };

    componentWillMount() {
      this._cache = {};
      this._handleSearchDebounced = debounce(
        this._handleSearch,
        this.props.delay
      );
    }

    componentWillReceiveProps(nextProps) {
      const {options, useCache} = nextProps;

      if (!this.props.isLoading) {
        return;
      }

      if (useCache) {
        this._cache[this.state.query] = options;
      }
    }

    componentWillUnmount() {
      this._cache = {};
      this._handleSearchDebounced.cancel();
    }

    render() {
      const {allowNew, options, useCache, ...props} = this.props;
      const cachedQuery = this._cache[this.state.query];
      const emptyLabel = this._getEmptyLabel();

      // Short-circuit the creation of custom selections while the user is in
      // the process of searching. The logic for whether or not to display the
      // custom menu option is basically the same as whether we display the
      // empty label, so use that as a proxy.
      const shouldAllowNew = allowNew && emptyLabel === props.emptyLabel;

      return (
        <Typeahead
          {...props}
          allowNew={shouldAllowNew}
          emptyLabel={emptyLabel}
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
        multiple,
        promptText,
        searchText,
        useCache,
      } = this.props;

      const {hasSelection, query} = this.state;

      if (!query.length || (!multiple && hasSelection)) {
        return promptText;
      }

      if (isLoading || (useCache && !this._cache[query])) {
        return searchText;
      }

      return emptyLabel;
    }

    _handleInputChange = (query) => {
      this.props.onInputChange && this.props.onInputChange(query);
      this._handleSearchDebounced(query);
    }

    _handleSearch = (query) => {
      const {minLength, onSearch, useCache} = this.props;

      this.setState({query});

      if (!query || (minLength && query.length < minLength)) {
        return;
      }

      // Use cached results, if available.
      if (useCache && this._cache[query]) {
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
     * Callback to perform when the search is executed.
     */
    onSearch: PropTypes.func.isRequired,
    /**
     * Options to be passed to the typeahead. Will typically be the query
     * results, but can also be initial default options.
     */
    options: PropTypes.array,
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
