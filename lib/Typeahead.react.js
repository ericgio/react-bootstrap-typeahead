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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getInitialState(props) {
  var defaultSelected = props.defaultSelected,
      maxResults = props.maxResults;


  var selected = props.selected.slice();
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
}

/**
 * Typeahead
 */

var Typeahead = function (_React$Component) {
  _inherits(Typeahead, _React$Component);

  function Typeahead(props) {
    _classCallCheck(this, Typeahead);

    var _this = _possibleConstructorReturn(this, (Typeahead.__proto__ || Object.getPrototypeOf(Typeahead)).call(this, props));

    _this._getFilteredResults = function () {
      var _this$props = _this.props,
          caseSensitive = _this$props.caseSensitive,
          filterBy = _this$props.filterBy,
          ignoreDiacritics = _this$props.ignoreDiacritics,
          labelKey = _this$props.labelKey,
          minLength = _this$props.minLength,
          multiple = _this$props.multiple,
          options = _this$props.options;
      var _this$state = _this.state,
          selected = _this$state.selected,
          text = _this$state.text;


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
    };

    _this.blur = function () {
      _this.refs.input.blur();
      _this._hideDropdown();
    };

    _this.clear = function () {
      _this.setState(getInitialState(_this.props));

      _this._updateSelected([]);
      _this._updateText('');
    };

    _this.focus = function () {
      _this.refs.input.focus();
    };

    _this._renderInput = function (results) {
      var _this$props2 = _this.props,
          bsSize = _this$props2.bsSize,
          disabled = _this$props2.disabled,
          labelKey = _this$props2.labelKey,
          minLength = _this$props2.minLength,
          multiple = _this$props2.multiple,
          name = _this$props2.name,
          placeholder = _this$props2.placeholder,
          renderToken = _this$props2.renderToken;
      var _this$state2 = _this.state,
          activeIndex = _this$state2.activeIndex,
          activeItem = _this$state2.activeItem,
          initialItem = _this$state2.initialItem,
          selected = _this$state2.selected,
          text = _this$state2.text;

      var Input = multiple ? _TokenizerInput2.default : _TypeaheadInput2.default;
      var inputProps = { bsSize: bsSize, disabled: disabled, name: name, placeholder: placeholder, renderToken: renderToken };

      return _react2.default.createElement(Input, _extends({}, inputProps, {
        activeIndex: activeIndex,
        activeItem: activeItem,
        hasAux: !!_this._renderAux(),
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
        onAdd: _this._handleAddOption,
        onBlur: _this._handleBlur,
        onChange: _this._handleTextChange,
        onFocus: _this._handleFocus,
        onKeyDown: function onKeyDown(e) {
          return _this._handleKeydown(results, e);
        },
        onRemove: _this._handleRemoveOption,
        options: results,
        ref: 'input',
        selected: selected.slice(),
        value: (0, _getInputText2.default)({ activeItem: activeItem, labelKey: labelKey, multiple: multiple, selected: selected, text: text })
      }));
    };

    _this._renderMenu = function (results, shouldPaginate) {
      var _this$props3 = _this.props,
          align = _this$props3.align,
          bodyContainer = _this$props3.bodyContainer,
          dropup = _this$props3.dropup,
          emptyLabel = _this$props3.emptyLabel,
          labelKey = _this$props3.labelKey,
          maxHeight = _this$props3.maxHeight,
          minLength = _this$props3.minLength,
          newSelectionPrefix = _this$props3.newSelectionPrefix,
          paginationText = _this$props3.paginationText,
          renderMenu = _this$props3.renderMenu,
          renderMenuItemChildren = _this$props3.renderMenuItemChildren;
      var _this$state3 = _this.state,
          showMenu = _this$state3.showMenu,
          text = _this$state3.text;


      var menuProps = {
        align: align,
        dropup: dropup,
        emptyLabel: emptyLabel,
        labelKey: labelKey,
        maxHeight: maxHeight,
        newSelectionPrefix: newSelectionPrefix,
        paginationText: paginationText,
        onPaginate: _this._handlePagination,
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
          container: bodyContainer ? document.body : _this,
          show: showMenu && text.length >= minLength,
          target: function target() {
            return _this.refs.input;
          } },
        menu
      );
    };

    _this._renderAux = function () {
      var _this$props4 = _this.props,
          bsSize = _this$props4.bsSize,
          clearButton = _this$props4.clearButton,
          disabled = _this$props4.disabled,
          isLoading = _this$props4.isLoading;


      if (isLoading) {
        return _react2.default.createElement(_Loader2.default, { bsSize: bsSize });
      }

      if (clearButton && !disabled && _this.state.selected.length) {
        return _react2.default.createElement(_ClearButton2.default, {
          bsSize: bsSize,
          className: 'bootstrap-typeahead-clear-button',
          onClick: _this.clear
        });
      }
    };

    _this._handleActiveItemChange = function (activeItem) {
      _this.setState({ activeItem: activeItem });
    };

    _this._handleBlur = function (e) {
      // Note: Don't hide the menu here, since that interferes with other actions
      // like making a selection by clicking on a menu item.
      _this.props.onBlur(e);
    };

    _this._handleFocus = function (e) {
      _this.props.onFocus(e);
      _this.setState({ showMenu: true });
    };

    _this._handleInitialItemChange = function (initialItem) {
      var currentItem = _this.state.initialItem;

      if (!currentItem) {
        _this.setState({ initialItem: initialItem });
        return;
      }

      var labelKey = _this.props.labelKey;

      // Don't update the initial item if it hasn't changed. For custom items,
      // compare the `labelKey` values since a unique id is generated each time,
      // causing the comparison to always return false otherwise.

      if ((0, _isEqual3.default)(initialItem, currentItem) || initialItem.customOption && initialItem[labelKey] === currentItem[labelKey]) {
        return;
      }

      _this.setState({ initialItem: initialItem });
    };

    _this._handleTextChange = function (text) {
      var _getInitialState = getInitialState(_this.props),
          activeIndex = _getInitialState.activeIndex,
          activeItem = _getInitialState.activeItem;

      _this.setState({
        activeIndex: activeIndex,
        activeItem: activeItem,
        showMenu: true
      });
      _this._updateText(text);
    };

    _this._handleKeydown = function (options, e) {
      var _this$state4 = _this.state,
          activeItem = _this$state4.activeItem,
          showMenu = _this$state4.showMenu;


      switch (e.keyCode) {
        case _keyCode.UP:
        case _keyCode.DOWN:
          // Don't cycle through the options if the menu is hidden.
          if (!showMenu) {
            return;
          }

          var activeIndex = _this.state.activeIndex;

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

          _this.setState(newState);
          break;
        case _keyCode.ESC:
        case _keyCode.TAB:
          // Prevent closing dialogs.
          e.keyCode === _keyCode.ESC && e.preventDefault();

          _this._hideDropdown();
          break;
        case _keyCode.RETURN:
          // if menu is shown and we have active item
          // there is no any sense to submit form on <RETURN>
          if (!_this.props.submitFormOnEnter || showMenu && activeItem) {
            // Prevent submitting forms.
            e.preventDefault();
          }

          if (showMenu && activeItem) {
            _this._handleAddOption(activeItem);
          }
          break;
      }
    };

    _this._handleAddOption = function (selectedOption) {
      var _this$props5 = _this.props,
          multiple = _this$props5.multiple,
          labelKey = _this$props5.labelKey;


      var selected = void 0;
      var text = void 0;

      if (multiple) {
        // If multiple selections are allowed, add the new selection to the
        // existing selections.
        selected = _this.state.selected.concat(selectedOption);
        text = '';
      } else {
        // If only a single selection is allowed, replace the existing selection
        // with the new one.
        selected = [selectedOption];
        text = (0, _getOptionLabel2.default)(selectedOption, labelKey);
      }

      _this._hideDropdown();
      _this._updateSelected(selected);
      _this._updateText(text);

      _this.setState({ initialItem: selectedOption });
    };

    _this._handlePagination = function (e) {
      var _this$props6 = _this.props,
          maxResults = _this$props6.maxResults,
          onPaginate = _this$props6.onPaginate;


      onPaginate(e);
      _this.setState({ shownResults: _this.state.shownResults + maxResults });
    };

    _this._handleRemoveOption = function (removedOption) {
      var selected = _this.state.selected.filter(function (option) {
        return !(0, _isEqual3.default)(option, removedOption);
      });

      // Make sure the input stays focused after the item is removed.
      _this.focus();
      _this._hideDropdown();
      _this._updateSelected(selected);
    };

    _this.handleClickOutside = function (e) {
      _this.state.showMenu && _this._hideDropdown();
    };

    _this._hideDropdown = function () {
      var _getInitialState2 = getInitialState(_this.props),
          activeIndex = _getInitialState2.activeIndex,
          activeItem = _getInitialState2.activeItem,
          showMenu = _getInitialState2.showMenu,
          shownResults = _getInitialState2.shownResults;

      _this.setState({
        activeIndex: activeIndex,
        activeItem: activeItem,
        showMenu: showMenu,
        shownResults: shownResults
      });
    };

    _this._updateSelected = function (selected) {
      _this.setState({ selected: selected });
      _this.props.onChange(selected);
    };

    _this._updateText = function (text) {
      _this.setState({ text: text });
      _this.props.onInputChange(text);
    };

    _this.state = getInitialState(props);
    return _this;
  }

  _createClass(Typeahead, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        activeIndex: this.state.activeIndex,
        onActiveItemChange: this._handleActiveItemChange,
        onInitialItemChange: this._handleInitialItemChange,
        onMenuItemClick: this._handleAddOption
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          allowNew = _props.allowNew,
          caseSensitive = _props.caseSensitive,
          filterBy = _props.filterBy,
          ignoreDiacritics = _props.ignoreDiacritics,
          labelKey = _props.labelKey;


      (0, _warn2.default)(!(typeof filterBy === 'function' && (caseSensitive || !ignoreDiacritics)), 'Your `filterBy` function will override the `caseSensitive` and ' + '`ignoreDiacritics` props.');

      (0, _warn2.default)(!(typeof labelKey === 'function' && allowNew), '`labelKey` must be a string if creating new options is allowed.');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.autoFocus && this.focus();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var multiple = nextProps.multiple,
          selected = nextProps.selected;

      // If new selections are passed via props, treat as a controlled input.

      if (!(0, _isEqual3.default)(selected, this.props.selected)) {
        this.setState({ selected: selected });
      }

      // If component changes from multi-select to single-select, keep only the
      // first selection, if any.
      if (this.props.multiple && !multiple) {
        this._updateSelected(this.state.selected.slice(0, 1));
      }

      if (multiple !== this.props.multiple) {
        this.setState({ text: '' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          allowNew = _props2.allowNew,
          className = _props2.className,
          dropup = _props2.dropup,
          labelKey = _props2.labelKey,
          paginate = _props2.paginate;
      var _state = this.state,
          shownResults = _state.shownResults,
          text = _state.text;

      // First filter the results by the input string.

      var results = this._getFilteredResults();

      // This must come before we truncate.
      var shouldPaginate = paginate && results.length > shownResults;

      // Truncate if necessary.
      results = (0, _getTruncatedOptions2.default)(results, shownResults);

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
    }

    /**
     * Public method to allow external clearing of the input. Clears both text
     * and selection(s).
     */


    /**
     * From `onClickOutside` HOC.
     */

  }]);

  return Typeahead;
}(_react2.default.Component);

Typeahead.propTypes = {
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
};

Typeahead.defaultProps = {
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

Typeahead.childContextTypes = {
  activeIndex: _propTypes2.default.number.isRequired,
  onActiveItemChange: _propTypes2.default.func.isRequired,
  onInitialItemChange: _propTypes2.default.func.isRequired,
  onMenuItemClick: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactOnclickoutside2.default)(Typeahead);