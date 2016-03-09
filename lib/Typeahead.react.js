'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TokenizerInput = require('./TokenizerInput.react');

var _TokenizerInput2 = _interopRequireDefault(_TokenizerInput);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _lodash = require('lodash');

var _keyCode = require('./keyCode');

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropTypes = _react2.default.PropTypes;

require('../css/Typeahead.css');

/**
 * Typeahead
 */
var Typeahead = _react2.default.createClass({
  displayName: 'Typeahead',

  mixins: [_reactOnclickoutside2.default],

  propTypes: {
    /**
     * Allows the creation of new selections on the fly. Note that any new items
     * will be added to the list of selections, but not the list of original
     * options unless handled as such by `Typeahead`'s parent.
     */
    allowNew: PropTypes.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: PropTypes.array,
    /**
     * Whether to disable the input. Will also disable selections when
     * `multiple={true}`.
     */
    disabled: PropTypes.bool,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: PropTypes.bool,
    /**
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: PropTypes.string,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
    /**
     * Placeholder text for the input.
     */
    placeholder: PropTypes.string,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: PropTypes.array
  },

  getDefaultProps: function getDefaultProps() {
    return {
      allowNew: false,
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
      selected: []
    };
  },
  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultSelected = _props.defaultSelected;
    var selected = _props.selected;

    return {
      activeIndex: 0,
      selected: !(0, _lodash.isEmpty)(defaultSelected) ? defaultSelected : selected,
      showMenu: false,
      text: ''
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!(0, _lodash.isEqual)(this.props.selected, nextProps.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({ selected: nextProps.selected });
    }

    if (this.props.multiple !== nextProps.multiple) {
      this.setState({ text: '' });
    }
  },
  render: function render() {
    var _props2 = this.props;
    var labelKey = _props2.labelKey;
    var multiple = _props2.multiple;
    var options = _props2.options;
    var _state = this.state;
    var activeIndex = _state.activeIndex;
    var selected = _state.selected;
    var text = _state.text;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.

    var filteredOptions = options.filter(function (option) {
      return !(option[labelKey].toLowerCase().indexOf(text.toLowerCase()) === -1 || multiple && (0, _lodash.find)(selected, option));
    });

    if (!filteredOptions.length && this.props.allowNew) {
      var newOption = {
        id: (0, _lodash.uniqueId)('new-id-'),
        customOption: true
      };
      newOption[labelKey] = text;
      filteredOptions = [newOption];
    }

    var menu = undefined;
    if (this.state.showMenu) {
      menu = _react2.default.createElement(_TypeaheadMenu2.default, {
        activeIndex: activeIndex,
        emptyLabel: this.props.emptyLabel,
        labelKey: labelKey,
        maxHeight: this.props.maxHeight,
        onClick: this._handleAddOption,
        options: filteredOptions
      });
    }

    var InputComponent = _TokenizerInput2.default;

    if (!multiple) {
      InputComponent = _TypeaheadInput2.default;
      selected = (0, _lodash.head)(selected);
      text = selected && selected[labelKey] || text;
    }

    return _react2.default.createElement(
      'div',
      {
        className: 'bootstrap-typeahead open',
        style: { position: 'relative' } },
      _react2.default.createElement(InputComponent, {
        disabled: this.props.disabled,
        filteredOptions: filteredOptions,
        labelKey: labelKey,
        onAdd: this._handleAddOption,
        onChange: this._handleTextChange,
        onFocus: this._handleFocus,
        onKeyDown: this._handleKeydown.bind(null, filteredOptions),
        onRemove: this._handleRemoveOption,
        placeholder: this.props.placeholder,
        ref: 'input',
        selected: selected,
        text: text
      }),
      menu
    );
  },
  _handleFocus: function _handleFocus() {
    this.setState({ showMenu: true });
  },
  _handleTextChange: function _handleTextChange(e) {
    this.setState({
      activeIndex: 0,
      showMenu: true,
      text: e.target.value
    });
  },
  _handleKeydown: function _handleKeydown(options, e) {
    var activeIndex = this.state.activeIndex;

    switch (e.keyCode) {
      case _keyCode.BACKSPACE:
        // Don't let the browser go back.
        e.stopPropagation();
        break;
      case _keyCode.UP:
        // Prevent page from scrolling.
        e.preventDefault();

        activeIndex--;
        if (activeIndex < 0) {
          activeIndex = options.length - 1;
        }
        this.setState({ activeIndex: activeIndex });
        break;
      case _keyCode.DOWN:
      case _keyCode.TAB:
        // Prevent page from scrolling.
        e.preventDefault();

        activeIndex++;
        if (activeIndex === options.length) {
          activeIndex = 0;
        }
        this.setState({ activeIndex: activeIndex });
        break;
      case _keyCode.ESC:
        // Prevent things like unintentionally closing dialogs.
        e.stopPropagation();
        this._hideDropdown();
        break;
      case _keyCode.RETURN:
        var selected = options[activeIndex];
        selected && this._handleAddOption(selected);
        break;
    }
  },
  _handleAddOption: function _handleAddOption(selectedOption) {
    var _props3 = this.props;
    var multiple = _props3.multiple;
    var labelKey = _props3.labelKey;
    var onChange = _props3.onChange;

    var selected = undefined;
    var text = undefined;

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

    this.setState({
      activeIndex: 0,
      selected: selected,
      showMenu: false,
      text: text
    });

    onChange && onChange(selected);
  },
  _handleRemoveOption: function _handleRemoveOption(removedOption) {
    var selected = this.state.selected.slice();
    selected = selected.filter(function (option) {
      return !(0, _lodash.isEqual)(option, removedOption);
    });

    this.setState({
      activeIndex: 0,
      selected: selected,
      showMenu: false
    });

    this.props.onChange && this.props.onChange(selected);
  },

  /**
   * From `onClickOutside` mixin.
   */
  handleClickOutside: function handleClickOutside(e) {
    this._hideDropdown();
  },
  _hideDropdown: function _hideDropdown() {
    this.setState({
      activeIndex: 0,
      showMenu: false
    });
  }
});

exports.default = Typeahead;