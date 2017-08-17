'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  var Container = function (_React$Component) {
    _inherits(Container, _React$Component);

    function Container(props) {
      _classCallCheck(this, Container);

      var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

      _this._handleChange = _this._handleChange.bind(_this);
      _this._handleInputChange = _this._handleInputChange.bind(_this);
      _this._handleSearch = _this._handleSearch.bind(_this);

      _this.state = {
        hasSelection: false,
        query: '',
        requestPending: false
      };
      return _this;
    }

    _createClass(Container, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._cache = {};
        this._handleSearchDebounced = (0, _debounce3.default)(this._handleSearch, this.props.delay);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var options = nextProps.options,
            useCache = nextProps.useCache;
        var _state = this.state,
            query = _state.query,
            requestPending = _state.requestPending;


        if (!requestPending) {
          return;
        }

        if (useCache) {
          this._cache[query] = options;
        }

        this.setState({ requestPending: false });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._cache = {};
        this._handleSearchDebounced.cancel();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            allowNew = _props.allowNew,
            options = _props.options,
            useCache = _props.useCache,
            props = _objectWithoutProperties(_props, ['allowNew', 'options', 'useCache']);

        var cachedQuery = this._cache[this.state.query];
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
            return _this2._instance = instance;
          }
        }));
      }

      /**
       * Make the component instance available.
       */

    }, {
      key: 'getInstance',
      value: function getInstance() {
        return this._instance.getInstance();
      }
    }, {
      key: '_getEmptyLabel',
      value: function _getEmptyLabel() {
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

        if (requestPending || useCache && !this._cache[query]) {
          return searchText;
        }

        return emptyLabel;
      }
    }, {
      key: '_handleChange',
      value: function _handleChange(selected) {
        // this.setState({hasSelection: !!selected.length});
        this.props.onChange && this.props.onChange(selected);
      }
    }, {
      key: '_handleInputChange',
      value: function _handleInputChange(query) {
        this.props.onInputChange && this.props.onInputChange(query);
        this._handleSearchDebounced(query);
      }
    }, {
      key: '_handleSearch',
      value: function _handleSearch(initialQuery) {
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
        if (useCache && this._cache[query]) {
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
    }]);

    return Container;
  }(_react2.default.Component);

  Container.propTypes = {
    /**
     * Delay, in milliseconds, before performing search.
     */
    delay: _propTypes2.default.number,
    /**
     * Callback to perform when the search is executed.
     */
    onSearch: _propTypes2.default.func.isRequired,
    /**
     * Options to be passed to the typeahead. Will typically be the query
     * results, but can also be initial default options.
     */
    options: _propTypes2.default.array,
    /**
     * Text displayed in the menu when there is no user input.
     */
    promptText: _propTypes2.default.string,
    /**
     * Text displayed in the menu while the request is pending.
     */
    searchText: _propTypes2.default.string,
    /**
     * Whether or not the component should cache query results.
     */
    useCache: _propTypes2.default.bool
  };

  Container.defaultProps = {
    delay: DEFAULT_DELAY_MS,
    minLength: 2,
    options: [],
    promptText: 'Type to search...',
    searchText: 'Searching...',
    useCache: true
  };

  return Container;
};

exports.default = asyncContainer;