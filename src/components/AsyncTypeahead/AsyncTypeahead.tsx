import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import useAsync, { UseAsyncProps } from '../../core/useAsync';
import TypeaheadComponent from '../Typeahead';
import Typeahead from '../../core/Typeahead';

const AsyncTypeahead = forwardRef<Typeahead, UseAsyncProps>((props, ref) => (
  <TypeaheadComponent {...useAsync(props)} ref={ref} />
));

AsyncTypeahead.propTypes = {
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

export default AsyncTypeahead;
