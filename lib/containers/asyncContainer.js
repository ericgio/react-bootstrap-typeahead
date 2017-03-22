'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DEFAULT_DELAY_MS = 200;

/**
 * HoC that encapsulates common behavior and functionality for doing
 * asynchronous searches, including:
 *
 *  - Debouncing user input
 *  - Query caching (optional)
 *  - Search prompt and empty results behaviors
 */
var asyncContainer = function asyncContainer(Typeahead) {

  var _cache = {};

  return _react2.default.createClass({
    propTypes: {
      /**
       * Delay, in milliseconds, before performing search.
       */
      delay: _react.PropTypes.number,
      /**
       * Callback to perform when the search is executed.
       */
      onSearch: _react.PropTypes.func.isRequired,
      /**
       * Options to be passed to the typeahead. Will typically be the query
       * results, but can also be initial default options.
       */
      options: _react.PropTypes.array,
      /**
       * Text displayed in the menu when there is no user input.
       */
      promptText: _react.PropTypes.string,
      /**
       * Text displayed in the menu while the request is pending.
       */
      searchText: _react.PropTypes.string,
      /**
       * Whether or not the component should cache query results.
       */
      useCache: _react.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
      return {
        delay: DEFAULT_DELAY_MS,
        minLength: 2,
        options: [],
        promptText: 'Type to search...',
        searchText: 'Searching...',
        useCache: true
      };
    },
    getInitialState: function getInitialState() {
      return {
        hasSelection: false,
        query: '',
        requestPending: false
      };
    },
    componentWillMount: function componentWillMount() {
      this._handleSearchDebounced = (0, _debounce3.default)(this._handleSearch, this.props.delay);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var options = nextProps.options,
          useCache = nextProps.useCache;
      var _state = this.state,
          query = _state.query,
          requestPending = _state.requestPending;


      if (!requestPending) {
        return;
      }

      if (useCache) {
        _cache[query] = options;
      }

      this.setState({ requestPending: false });
    },
    componentWillUnmount: function componentWillUnmount() {
      _cache = {};
    },
    render: function render() {
      var _this = this;

      var _props = this.props,
          allowNew = _props.allowNew,
          options = _props.options,
          useCache = _props.useCache,
          props = _objectWithoutProperties(_props, ['allowNew', 'options', 'useCache']);

      var cachedQuery = _cache[this.state.query];
      var emptyLabel = this._getEmptyLabel();

      // Short-circuit the creation of custom selections while the user is in
      // the process of searching. The logic for whether or not to display the
      // custom menu option is basically the same as whether we display the
      // empty label, so use that as a proxy.
      var shouldAllowNew = allowNew && emptyLabel === props.emptyLabel;

      return _react2.default.createElement(Typeahead, _extends({}, props, {
        allowNew: shouldAllowNew,
        emptyLabel: emptyLabel,
        isLoading: this.state.requestPending,
        onChange: this._handleChange,
        onInputChange: this._handleInputChange,
        options: useCache && cachedQuery ? cachedQuery : options,
        ref: function ref(instance) {
          return _this._instance = instance;
        }
      }));
    },


    /**
     * Make the component instance available.
     */
    getInstance: function getInstance() {
      return this._instance.getInstance();
    },
    _getEmptyLabel: function _getEmptyLabel() {
      var _props2 = this.props,
          emptyLabel = _props2.emptyLabel,
          multiple = _props2.multiple,
          promptText = _props2.promptText,
          searchText = _props2.searchText,
          useCache = _props2.useCache;
      var _state2 = this.state,
          hasSelection = _state2.hasSelection,
          query = _state2.query,
          requestPending = _state2.requestPending;


      if (!query.length || !multiple && hasSelection) {
        return promptText;
      }

      if (requestPending || useCache && !_cache[query]) {
        return searchText;
      }

      return emptyLabel;
    },
    _handleChange: function _handleChange(selected) {
      this.props.onChange && this.props.onChange(selected);
      this.setState({ hasSelection: !!selected.length });
    },
    _handleInputChange: function _handleInputChange(query) {
      this.props.onInputChange && this.props.onInputChange(query);
      this._handleSearchDebounced(query);
    },
    _handleSearch: function _handleSearch(initialQuery) {
      var _props3 = this.props,
          caseSensitive = _props3.caseSensitive,
          minLength = _props3.minLength,
          multiple = _props3.multiple,
          onSearch = _props3.onSearch,
          useCache = _props3.useCache;


      var query = initialQuery.trim();
      if (!caseSensitive) {
        query = query.toLowerCase();
      }

      this.setState({ query: query });

      if (!query || minLength && query.length < minLength) {
        return;
      }

      // Use cached results, if available.
      if (useCache && _cache[query]) {
        return;
      }

      // In the single-selection case, perform a search only on user input
      // not selection.
      if (!multiple && this.state.hasSelection) {
        return;
      }

      // Perform the async search.
      this.setState({ requestPending: true }, function () {
        return onSearch(query);
      });
    }
  });
};

exports.default = asyncContainer;