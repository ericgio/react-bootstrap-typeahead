'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _ClearButton = require('./ClearButton.react');

var _ClearButton2 = _interopRequireDefault(_ClearButton);

var _Loader = require('./Loader.react');

var _Loader2 = _interopRequireDefault(_Loader);

var _Overlay = require('./Overlay.react');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _TokenizerInput = require('./TokenizerInput.react');

var _TokenizerInput2 = _interopRequireDefault(_TokenizerInput);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _addCustomOption = require('./utils/addCustomOption');

var _addCustomOption2 = _interopRequireDefault(_addCustomOption);

var _defaultFilterBy = require('./utils/defaultFilterBy');

var _defaultFilterBy2 = _interopRequireDefault(_defaultFilterBy);

var _getHintText = require('./utils/getHintText');

var _getHintText2 = _interopRequireDefault(_getHintText);

var _getInputText = require('./utils/getInputText');

var _getInputText2 = _interopRequireDefault(_getInputText);

var _getOptionLabel = require('./utils/getOptionLabel');

var _getOptionLabel2 = _interopRequireDefault(_getOptionLabel);

var _getTruncatedOptions = require('./utils/getTruncatedOptions');

var _getTruncatedOptions2 = _interopRequireDefault(_getTruncatedOptions);

var _warn = require('./utils/warn');

var _warn2 = _interopRequireDefault(_warn);

var _keyCode = require('./utils/keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Typeahead
 */
var Typeahead = (0, _createReactClass2.default)({
  displayName: 'Typeahead',

  propTypes: {
    /**
     * Allows the creation of new selections on the fly. Note that any new items
     * will be added to the list of selections, but not the list of original
     * options unless handled as such by `Typeahead`'s parent.
     */
    allowNew: _propTypes2.default.bool,
    /**
     * Autofocus the input when the component initially mounts.
     */
    autoFocus: _propTypes2.default.bool,
    /**
     * Whether to render the menu inline or attach to `document.body`.
     */
    bodyContainer: _propTypes2.default.bool,
    /**
     * Whether or not filtering should be case-sensitive.
     */
    caseSensitive: _propTypes2.default.bool,
    /**
     * Displays a button to clear the input when there are selections.
     */
    clearButton: _propTypes2.default.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: _propTypes2.default.array,
    /**
     * Specify whether the menu should appear above the input.
     */
    dropup: _propTypes2.default.bool,
    /**
     * Either an array of fields in `option` to search, or a custom filtering
     * callback.
     */
    filterBy: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.string.isRequired), _propTypes2.default.func]),
    /**
     * Whether the filter should ignore accents and other diacritical marks.
     */
    ignoreDiacritics: _propTypes2.default.bool,
    /**
     * Indicate whether an asynchromous data fetch is happening.
     */
    isLoading: _propTypes2.default.bool,
    /**
     * Specify the option key to use for display or a function returning the
     * display string. By default, the selector will use the `label` key.
     */
    labelKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    /**
     * Maximum number of results to display by default. Mostly done for
     * performance reasons so as not to render too many DOM nodes in the case of
     * large data sets.
     */
    maxResults: _propTypes2.default.number,
    /**
     * Number of input characters that must be entered before showing results.
     */
    minLength: _propTypes2.default.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: _propTypes2.default.bool,
    /**
     * Invoked when the input is blurred. Receives an event.
     */
    onBlur: _propTypes2.default.func,
    /**
     * Invoked whenever items are added or removed. Receives an array of the
     * selected options.
     */
    onChange: _propTypes2.default.func,
    /**
     * Invoked when the input is focused. Receives an event.
     */
    onFocus: _propTypes2.default.func,
    /**
     * Invoked when the input value changes. Receives the string value of the
     * input.
     */
    onInputChange: _propTypes2.default.func,
    /**
     * Invoked when the pagination menu item is clicked. Receives an event.
     */
    onPaginate: _propTypes2.default.func,
    /**
     * Full set of options, including pre-selected options. Must either be an
     * array of objects (recommended) or strings.
     */
    options: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object.isRequired), _propTypes2.default.arrayOf(_propTypes2.default.string.isRequired)]).isRequired,
    /**
     * Give user the ability to display additional results if the number of
     * results exceeds `maxResults`.
     */
    paginate: _propTypes2.default.bool,
    /**
     * Callback for custom menu rendering.
     */
    renderMenu: _propTypes2.default.func,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: _propTypes2.default.array,
    /**
     * Propagate <RETURN> event to parent form.
     */
    submitFormOnEnter: _propTypes2.default.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      allowNew: false,
      autoFocus: false,
      bodyContainer: false,
      caseSensitive: false,
      clearButton: false,
      defaultSelected: [],
      dropup: false,
      filterBy: [],
      ignoreDiacritics: true,
      isLoading: false,
      labelKey: 'label',
      maxResults: 100,
      minLength: 0,
      multiple: false,
      onBlur: _noop3.default,
      onChange: _noop3.default,
      onFocus: _noop3.default,
      onInputChange: _noop3.default,
      onPaginate: _noop3.default,
      paginate: true,
      selected: [],
      submitFormOnEnter: false
    };
  },


  childContextTypes: {
    activeIndex: _propTypes2.default.number.isRequired,
    onActiveItemChange: _propTypes2.default.func.isRequired,
    onInitialItemChange: _propTypes2.default.func.isRequired,
    onMenuItemClick: _propTypes2.default.func.isRequired
  },

  getChildContext: function getChildContext() {
    return {
      activeIndex: this.state.activeIndex,
      onActiveItemChange: this._handleActiveItemChange,
      onInitialItemChange: this._handleInitialItemChange,
      onMenuItemClick: this._handleAddOption
    };
  },
  getInitialState: function getInitialState() {
    var _props = this.props,
        defaultSelected = _props.defaultSelected,
        maxResults = _props.maxResults;


    var selected = this.props.selected.slice();
    if (defaultSelected && defaultSelected.length) {
      selected = defaultSelected;
    }

    return {
      activeIndex: -1,
      activeItem: null,
      initialItem: null,
      selected: selected,
      showMenu: false,
      shownResults: maxResults,
      text: ''
    };
  },
  componentWillMount: function componentWillMount() {
    var _props2 = this.props,
        allowNew = _props2.allowNew,
        caseSensitive = _props2.caseSensitive,
        filterBy = _props2.filterBy,
        ignoreDiacritics = _props2.ignoreDiacritics,
        labelKey = _props2.labelKey;


    (0, _warn2.default)(!(typeof filterBy === 'function' && (caseSensitive || !ignoreDiacritics)), 'Your `filterBy` function will override the `caseSensitive` and ' + '`ignoreDiacritics` props.');

    (0, _warn2.default)(!(typeof labelKey === 'function' && allowNew), '`labelKey` must be a string if creating new options is allowed.');
  },
  componentDidMount: function componentDidMount() {
    this.props.autoFocus && this.focus();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var multiple = nextProps.multiple,
        selected = nextProps.selected;


    if (!(0, _isEqual3.default)(selected, this.props.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({ selected: selected });
    }

    if (multiple !== this.props.multiple) {
      this.setState({ text: '' });
    }
  },
  render: function render() {
    var _props3 = this.props,
        allowNew = _props3.allowNew,
        className = _props3.className,
        dropup = _props3.dropup,
        labelKey = _props3.labelKey,
        paginate = _props3.paginate;
    var _state = this.state,
        shownResults = _state.shownResults,
        text = _state.text;

    // First filter the results by the input string.

    var results = this._getFilteredResults();

    // This must come before we truncate.
    var shouldPaginate = paginate && results.length > shownResults;

    // Truncate if necessary.
    if (shouldPaginate) {
      results = (0, _getTruncatedOptions2.default)(results, shownResults);
    }

    // Add the custom option.
    if (allowNew) {
      results = (0, _addCustomOption2.default)(results, text, labelKey);
    }

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-typeahead', 'clearfix', 'open', {
          'dropup': dropup
        }, className),
        style: { position: 'relative' } },
      this._renderInput(results),
      this._renderAux(),
      this._renderMenu(results, shouldPaginate)
    );
  },
  _getFilteredResults: function _getFilteredResults() {
    var _props4 = this.props,
        caseSensitive = _props4.caseSensitive,
        filterBy = _props4.filterBy,
        ignoreDiacritics = _props4.ignoreDiacritics,
        labelKey = _props4.labelKey,
        minLength = _props4.minLength,
        multiple = _props4.multiple,
        options = _props4.options;
    var _state2 = this.state,
        selected = _state2.selected,
        text = _state2.text;


    if (text.length < minLength) {
      return [];
    }

    var callback = Array.isArray(filterBy) ? function (option) {
      return (0, _defaultFilterBy2.default)(option, text, labelKey, multiple && !!(0, _find3.default)(selected, function (o) {
        return (0, _isEqual3.default)(o, option);
      }), { caseSensitive: caseSensitive, ignoreDiacritics: ignoreDiacritics, fields: filterBy });
    } : function (option) {
      return filterBy(option, text);
    };

    return options.filter(callback);
  },
  blur: function blur() {
    this.refs.input.blur();
    this._hideDropdown();
  },


  /**
   * Public method to allow external clearing of the input. Clears both text
   * and selection(s).
   */
  clear: function clear() {
    var _getInitialState = this.getInitialState(),
        activeIndex = _getInitialState.activeIndex,
        activeItem = _getInitialState.activeItem,
        showMenu = _getInitialState.showMenu;

    var selected = [];
    var text = '';

    this.setState({
      activeIndex: activeIndex,
      activeItem: activeItem,
      selected: selected,
      showMenu: showMenu,
      text: text
    });

    this.props.onChange(selected);
    this.props.onInputChange(text);
  },
  focus: function focus() {
    this.refs.input.focus();
  },
  _renderInput: function _renderInput(results) {
    var _this = this;

    var _props5 = this.props,
        bsSize = _props5.bsSize,
        disabled = _props5.disabled,
        labelKey = _props5.labelKey,
        minLength = _props5.minLength,
        multiple = _props5.multiple,
        name = _props5.name,
        placeholder = _props5.placeholder,
        renderToken = _props5.renderToken;
    var _state3 = this.state,
        activeIndex = _state3.activeIndex,
        activeItem = _state3.activeItem,
        initialItem = _state3.initialItem,
        selected = _state3.selected,
        text = _state3.text;

    var Input = multiple ? _TokenizerInput2.default : _TypeaheadInput2.default;
    var inputProps = { bsSize: bsSize, disabled: disabled, name: name, placeholder: placeholder, renderToken: renderToken };

    return _react2.default.createElement(Input, _extends({}, inputProps, {
      activeIndex: activeIndex,
      activeItem: activeItem,
      hasAux: !!this._renderAux(),
      hintText: (0, _getHintText2.default)({
        activeItem: activeItem,
        initialItem: initialItem,
        labelKey: labelKey,
        minLength: minLength,
        selected: selected,
        text: text
      }),
      initialItem: initialItem,
      labelKey: labelKey,
      onAdd: this._handleAddOption,
      onBlur: this._handleBlur,
      onChange: this._handleTextChange,
      onFocus: this._handleFocus,
      onKeyDown: function onKeyDown(e) {
        return _this._handleKeydown(results, e);
      },
      onRemove: this._handleRemoveOption,
      options: results,
      ref: 'input',
      selected: selected.slice(),
      value: (0, _getInputText2.default)({ activeItem: activeItem, labelKey: labelKey, multiple: multiple, selected: selected, text: text })
    }));
  },
  _renderMenu: function _renderMenu(results, shouldPaginate) {
    var _this2 = this;

    var _props6 = this.props,
        align = _props6.align,
        bodyContainer = _props6.bodyContainer,
        dropup = _props6.dropup,
        emptyLabel = _props6.emptyLabel,
        labelKey = _props6.labelKey,
        maxHeight = _props6.maxHeight,
        minLength = _props6.minLength,
        newSelectionPrefix = _props6.newSelectionPrefix,
        paginationText = _props6.paginationText,
        renderMenu = _props6.renderMenu,
        renderMenuItemChildren = _props6.renderMenuItemChildren;
    var _state4 = this.state,
        showMenu = _state4.showMenu,
        text = _state4.text;


    var menuProps = {
      align: align,
      dropup: dropup,
      emptyLabel: emptyLabel,
      labelKey: labelKey,
      maxHeight: maxHeight,
      newSelectionPrefix: newSelectionPrefix,
      paginationText: paginationText,
      onPaginate: this._handlePagination,
      paginate: shouldPaginate,
      text: text
    };

    var menu = renderMenu ? renderMenu(results, menuProps) : _react2.default.createElement(_TypeaheadMenu2.default, _extends({}, menuProps, {
      options: results,
      renderMenuItemChildren: renderMenuItemChildren
    }));

    return _react2.default.createElement(
      _Overlay2.default,
      {
        container: bodyContainer ? document.body : this,
        show: showMenu && text.length >= minLength,
        target: function target() {
          return _this2.refs.input;
        } },
      menu
    );
  },
  _renderAux: function _renderAux() {
    var _props7 = this.props,
        bsSize = _props7.bsSize,
        clearButton = _props7.clearButton,
        disabled = _props7.disabled,
        isLoading = _props7.isLoading;


    if (isLoading) {
      return _react2.default.createElement(_Loader2.default, { bsSize: bsSize });
    }

    if (clearButton && !disabled && this.state.selected.length) {
      return _react2.default.createElement(_ClearButton2.default, {
        bsSize: bsSize,
        className: 'bootstrap-typeahead-clear-button',
        onClick: this.clear
      });
    }
  },
  _handleActiveItemChange: function _handleActiveItemChange(activeItem) {
    this.setState({ activeItem: activeItem });
  },
  _handleBlur: function _handleBlur(e) {
    // Note: Don't hide the menu here, since that interferes with other actions
    // like making a selection by clicking on a menu item.
    this.props.onBlur(e);
  },
  _handleFocus: function _handleFocus(e) {
    this.props.onFocus(e);
    this.setState({ showMenu: true });
  },
  _handleInitialItemChange: function _handleInitialItemChange(initialItem) {
    var currentItem = this.state.initialItem;

    if (!currentItem) {
      this.setState({ initialItem: initialItem });
      return;
    }

    var labelKey = this.props.labelKey;

    // Don't update the initial item if it hasn't changed. For custom items,
    // compare the `labelKey` values since a unique id is generated each time,
    // causing the comparison to always return false otherwise.

    if ((0, _isEqual3.default)(initialItem, currentItem) || initialItem.customOption && initialItem[labelKey] === currentItem[labelKey]) {
      return;
    }

    this.setState({ initialItem: initialItem });
  },
  _handleTextChange: function _handleTextChange(text) {
    var _getInitialState2 = this.getInitialState(),
        activeIndex = _getInitialState2.activeIndex,
        activeItem = _getInitialState2.activeItem;

    this.setState({
      activeIndex: activeIndex,
      activeItem: activeItem,
      showMenu: true,
      text: text
    });

    this.props.onInputChange(text);
  },
  _handleKeydown: function _handleKeydown(options, e) {
    var _state5 = this.state,
        activeItem = _state5.activeItem,
        showMenu = _state5.showMenu;


    switch (e.keyCode) {
      case _keyCode.UP:
      case _keyCode.DOWN:
        // Don't cycle through the options if the menu is hidden.
        if (!showMenu) {
          return;
        }

        var activeIndex = this.state.activeIndex;

        // Prevents input cursor from going to the beginning when pressing up.

        e.preventDefault();

        // Increment or decrement index based on user keystroke.
        activeIndex += e.keyCode === _keyCode.UP ? -1 : 1;

        // If we've reached the end, go back to the beginning or vice-versa.
        if (activeIndex === options.length) {
          activeIndex = -1;
        } else if (activeIndex === -2) {
          activeIndex = options.length - 1;
        }

        var newState = { activeIndex: activeIndex };
        if (activeIndex === -1) {
          // Reset the active item if there is no active index.
          newState.activeItem = null;
        }

        this.setState(newState);
        break;
      case _keyCode.ESC:
      case _keyCode.TAB:
        // Prevent closing dialogs.
        e.keyCode === _keyCode.ESC && e.preventDefault();

        this._hideDropdown();
        break;
      case _keyCode.RETURN:
        // if menu is shown and we have active item
        // there is no any sense to submit form on <RETURN>
        if (!this.props.submitFormOnEnter || showMenu && activeItem) {
          // Prevent submitting forms.
          e.preventDefault();
        }

        if (showMenu && activeItem) {
          this._handleAddOption(activeItem);
        }
        break;
    }
  },
  _handleAddOption: function _handleAddOption(selectedOption) {
    var _props8 = this.props,
        multiple = _props8.multiple,
        labelKey = _props8.labelKey,
        onChange = _props8.onChange,
        onInputChange = _props8.onInputChange;


    var selected = void 0;
    var text = void 0;

    if (multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = this.state.selected.concat(selectedOption);
      text = '';
    } else {
      // If only a single selection is allowed, replace the existing selection
      // with the new one.
      selected = [selectedOption];
      text = (0, _getOptionLabel2.default)(selectedOption, labelKey);
    }

    this.setState({
      initialItem: selectedOption,
      selected: selected,
      text: text
    });
    this._hideDropdown();

    onChange(selected);
    onInputChange(text);
  },
  _handlePagination: function _handlePagination(e) {
    var _props9 = this.props,
        maxResults = _props9.maxResults,
        onPaginate = _props9.onPaginate;


    onPaginate(e);
    this.setState({ shownResults: this.state.shownResults + maxResults });
  },
  _handleRemoveOption: function _handleRemoveOption(removedOption) {
    var selected = this.state.selected.slice();
    selected = selected.filter(function (option) {
      return !(0, _isEqual3.default)(option, removedOption);
    });

    // Make sure the input stays focused after the item is removed.
    this.focus();

    this.setState({ selected: selected });
    this._hideDropdown();

    this.props.onChange(selected);
  },


  /**
   * From `onClickOutside` HOC.
   */
  handleClickOutside: function handleClickOutside(e) {
    this.state.showMenu && this._hideDropdown();
  },
  _hideDropdown: function _hideDropdown() {
    var _getInitialState3 = this.getInitialState(),
        activeIndex = _getInitialState3.activeIndex,
        activeItem = _getInitialState3.activeItem,
        showMenu = _getInitialState3.showMenu,
        shownResults = _getInitialState3.shownResults;

    this.setState({
      activeIndex: activeIndex,
      activeItem: activeItem,
      showMenu: showMenu,
      shownResults: shownResults
    });
  }
});

exports.default = (0, _reactOnclickoutside2.default)(Typeahead);