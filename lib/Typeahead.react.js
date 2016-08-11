'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TokenizerInput = require('./TokenizerInput.react');

var _TokenizerInput2 = _interopRequireDefault(_TokenizerInput);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _getFilteredOptions = require('./getFilteredOptions');

var _getFilteredOptions2 = _interopRequireDefault(_getFilteredOptions);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _keyCode = require('./keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Typeahead
 */
var Typeahead = _react2.default.createClass({
  displayName: 'Typeahead',

  propTypes: {
    /**
     * Specify menu alignment. The default value is `justify`, which makes the
     * menu as wide as the input and truncates long values. Specifying `left`
     * or `right` will align the menu to that side and the width will be
     * determined by the length of menu item values.
     */
    align: _react.PropTypes.oneOf(['justify', 'left', 'right']),
    /**
     * Allows the creation of new selections on the fly. Note that any new items
     * will be added to the list of selections, but not the list of original
     * options unless handled as such by `Typeahead`'s parent.
     */
    allowNew: _react.PropTypes.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: _react.PropTypes.array,
    /**
     * Whether to disable the input. Will also disable selections when
     * `multiple={true}`.
     */
    disabled: _react.PropTypes.bool,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: _react.PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: _react.PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: _react.PropTypes.number,
    /**
     * Number of input characters that must be entered before showing results.
     */
    minLength: _react.PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: _react.PropTypes.bool,
    /**
     * Name property for the input.
     */
    name: _react.PropTypes.string,
    /**
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: _react.PropTypes.string,
    /**
     * Callback fired when the input is blurred. Receives an event.
     */
    onBlur: _react.PropTypes.func,
    /**
     * Callback fired whenever items are added or removed. Receives an array of
     * the selected options.
     */
    onChange: _react.PropTypes.func,
    /**
     * Callback for handling changes to the user-input text.
     */
    onInputChange: _react.PropTypes.func,
    /**
     * Full set of options, including pre-selected options.
     */
    options: _react.PropTypes.array.isRequired,
    /**
     * For large option sets, initially display a subset of results for improved
     * performance. If users scroll to the end, the last item will be a link to
     * display the next set of results. Value represents the number of results
     * to display. `0` will display all results.
     */
    paginateResults: _react.PropTypes.number,
    /**
     * Prompt displayed when large data sets are paginated.
     */
    paginationText: _react.PropTypes.string,
    /**
     * Placeholder text for the input.
     */
    placeholder: _react.PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: _react.PropTypes.func,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: _react.PropTypes.array
  },

  getDefaultProps: function getDefaultProps() {
    return {
      allowNew: false,
      defaultSelected: [],
      labelKey: 'label',
      onBlur: _noop3.default,
      onChange: _noop3.default,
      onInputChange: _noop3.default,
      minLength: 0,
      multiple: false,
      selected: []
    };
  },
  getInitialState: function getInitialState() {
    var defaultSelected = this.props.defaultSelected;


    var selected = this.props.selected.slice();
    if (!(0, _isEmpty3.default)(defaultSelected)) {
      selected = defaultSelected;
    }

    return {
      activeIndex: -1,
      selected: selected,
      showMenu: false,
      text: ''
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var multiple = nextProps.multiple;
    var selected = nextProps.selected;


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
    var _props = this.props;
    var options = _props.options;

    var props = _objectWithoutProperties(_props, ['options']);

    var _state = this.state;
    var selected = _state.selected;
    var text = _state.text;

    var filteredOptions = (0, _getFilteredOptions2.default)(options, text, selected, props);

    return _react2.default.createElement(
      'div',
      {
        className: 'bootstrap-typeahead open',
        style: { position: 'relative' } },
      this._renderInput(filteredOptions),
      this._renderMenu(filteredOptions)
    );
  },
  blur: function blur() {
    this.refs.input.blur();
  },


  /**
   * Public method to allow external clearing of the input. Clears both text
   * and selection(s).
   */
  clear: function clear() {
    var _getInitialState = this.getInitialState();

    var activeIndex = _getInitialState.activeIndex;
    var showMenu = _getInitialState.showMenu;

    var selected = [];
    var text = '';

    this.setState({
      activeIndex: activeIndex,
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
  _renderInput: function _renderInput(filteredOptions) {
    var _this = this;

    var _props2 = this.props;
    var labelKey = _props2.labelKey;
    var multiple = _props2.multiple;
    var _state2 = this.state;
    var activeIndex = _state2.activeIndex;
    var selected = _state2.selected;
    var text = _state2.text;

    var Input = multiple ? _TokenizerInput2.default : _TypeaheadInput2.default;
    var inputProps = (0, _pick3.default)(this.props, ['disabled', 'name', 'placeholder']);

    return _react2.default.createElement(Input, _extends({}, inputProps, {
      activeIndex: activeIndex,
      labelKey: labelKey,
      onAdd: this._handleAddOption,
      onBlur: this._handleBlur,
      onChange: this._handleTextChange,
      onFocus: this._handleFocus,
      onKeyDown: function onKeyDown(e) {
        return _this._handleKeydown(filteredOptions, e);
      },
      onRemove: this._handleRemoveOption,
      options: filteredOptions,
      ref: 'input',
      selected: selected.slice(),
      text: text
    }));
  },
  _renderMenu: function _renderMenu(filteredOptions) {
    var _props3 = this.props;
    var labelKey = _props3.labelKey;
    var minLength = _props3.minLength;
    var _state3 = this.state;
    var activeIndex = _state3.activeIndex;
    var showMenu = _state3.showMenu;
    var text = _state3.text;


    if (!(showMenu && text.length >= minLength)) {
      return null;
    }

    var menuProps = (0, _pick3.default)(this.props, ['align', 'emptyLabel', 'maxHeight', 'newSelectionPrefix', 'paginationText', 'renderMenuItemChildren']);

    return _react2.default.createElement(_TypeaheadMenu2.default, _extends({}, menuProps, {
      activeIndex: activeIndex,
      initialResultCount: this.props.paginateResults,
      labelKey: labelKey,
      onClick: this._handleAddOption,
      options: filteredOptions,
      text: text
    }));
  },
  _handleBlur: function _handleBlur(e) {
    // Note: Don't hide the menu here, since that interferes with other actions
    // like making a selection by clicking on a menu item.
    this.props.onBlur(e);
  },
  _handleFocus: function _handleFocus() {
    this.setState({ showMenu: true });
  },
  _handleTextChange: function _handleTextChange(text) {
    var _getInitialState2 = this.getInitialState();

    var activeIndex = _getInitialState2.activeIndex;

    this.setState({
      activeIndex: activeIndex,
      showMenu: true,
      text: text
    });

    this.props.onInputChange(text);
  },
  _handleKeydown: function _handleKeydown(options, e) {
    var activeIndex = this.state.activeIndex;


    switch (e.keyCode) {
      case _keyCode.UP:
      case _keyCode.DOWN:
        // Don't cycle through the options if the menu is hidden.
        if (!this.state.showMenu) {
          return;
        }

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

        this.setState({ activeIndex: activeIndex });
        break;
      case _keyCode.ESC:
      case _keyCode.TAB:
        // Prevent closing dialogs.
        e.keyCode === _keyCode.ESC && e.preventDefault();

        this._hideDropdown();
        break;
      case _keyCode.RETURN:
        // Prevent submitting forms.
        e.preventDefault();

        if (this.state.showMenu) {
          var selected = options[activeIndex];
          selected && this._handleAddOption(selected);
        }
        break;
    }
  },
  _handleAddOption: function _handleAddOption(selectedOption) {
    var _props4 = this.props;
    var multiple = _props4.multiple;
    var labelKey = _props4.labelKey;
    var onChange = _props4.onChange;
    var onInputChange = _props4.onInputChange;


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
      text = selectedOption[labelKey];
    }

    this.setState({ selected: selected, text: text });
    this._hideDropdown();

    onChange(selected);
    onInputChange(text);
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
   * From `listensToClickOutside` HOC.
   */
  handleClickOutside: function handleClickOutside(e) {
    this._hideDropdown();
  },
  _hideDropdown: function _hideDropdown() {
    var _getInitialState3 = this.getInitialState();

    var activeIndex = _getInitialState3.activeIndex;
    var showMenu = _getInitialState3.showMenu;

    this.setState({
      activeIndex: activeIndex,
      showMenu: showMenu
    });
  }
});

exports.default = (0, _reactOnclickoutside2.default)(Typeahead);