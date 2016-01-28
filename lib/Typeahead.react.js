'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TokenizerInput = require('./TokenizerInput.react');

var _TokenizerInput2 = _interopRequireDefault(_TokenizerInput);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

var _lodash = require('lodash');

var _keyCode = require('./keyCode');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cloneElement = _react2.default.cloneElement;
var PropTypes = _react2.default.PropTypes;

require('../css/Typeahead.css');

/**
 * Typeahead
 */
var Typeahead = _react2.default.createClass({
  displayName: 'Typeahead',

  mixins: [_reactOnclickoutside2.default],

  propTypes: {
    defaultSelected: PropTypes.array,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: PropTypes.string,
    maxHeight: PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: PropTypes.bool,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    selected: PropTypes.array
  },

  getDefaultProps: function getDefaultProps() {
    return {
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
      selected: []
    };
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultSelected = _props.defaultSelected;
    var labelKey = _props.labelKey;
    var multiple = _props.multiple;
    var selected = _props.selected;

    var selected = !(0, _lodash.isEmpty)(defaultSelected) ? defaultSelected : selected;

    return {
      focusedMenuItem: null,
      selected: selected,
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
    var children = _props2.children;
    var labelKey = _props2.labelKey;
    var multiple = _props2.multiple;
    var options = _props2.options;
    var _state = this.state;
    var selected = _state.selected;
    var text = _state.text;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.

    var filteredOptions = options.filter(function (option) {
      return !(option[labelKey].toLowerCase().indexOf(text.toLowerCase()) === -1 || multiple && (0, _lodash.find)(selected, option));
    });

    var menu;
    if (this.state.showMenu) {
      menu = _react2.default.createElement(_TypeaheadMenu2.default, {
        emptyLabel: this.props.emptyLabel,
        labelKey: labelKey,
        maxHeight: this.props.maxHeight,
        onClick: this._handleAddOption,
        onKeyDown: this._handleKeydown,
        options: filteredOptions,
        ref: 'menu'
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
        filteredOptions: filteredOptions,
        labelKey: labelKey,
        onAdd: this._handleAddOption,
        onChange: this._handleTextChange,
        onFocus: this._handleFocus,
        onKeyDown: this._handleKeydown,
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
      showMenu: true,
      text: e.target.value
    });
  },

  _handleKeydown: function _handleKeydown(e) {
    var _state2 = this.state;
    var focusedMenuItem = _state2.focusedMenuItem;
    var text = _state2.text;

    switch (e.keyCode) {
      case _keyCode2.default.UP:
      case _keyCode2.default.DOWN:
      case _keyCode2.default.TAB:
        // Prevent page from scrolling when pressing up or down.
        e.preventDefault();

        // Look for the menu. It won't be there if there are no results.
        var menu = this.refs.menu && (0, _reactDom.findDOMNode)(this.refs.menu);
        if (!menu) {
          return;
        }

        if (e.keyCode === _keyCode2.default.UP) {
          if (!focusedMenuItem) {
            // The input is focused and the user pressed the down key; select
            // the first menu item.
            focusedMenuItem = menu.lastChild;
          } else {
            focusedMenuItem = focusedMenuItem.previousSibling || null;
          }
        } else {
          // keyCode.DOWN
          if (!focusedMenuItem) {
            // The input is focused and the user pressed the down key; select
            // the first menu item.
            focusedMenuItem = menu.firstChild;
          } else {
            focusedMenuItem = focusedMenuItem.nextSibling || null;
          }
        }

        if (focusedMenuItem) {
          // Select the link in the menu item.
          focusedMenuItem.firstChild.focus();
        } else {
          // If there's no focused item, it means we're at the beginning or the
          // end of the menu. Focus the input.
          (0, _reactDom.findDOMNode)(this.refs.input).focus();
        }

        this.setState({ focusedMenuItem: focusedMenuItem });
        break;
      case _keyCode2.default.ESC:
        // Prevent things like unintentionally closing dialogs.
        e.stopPropagation();
        this._hideDropdown();
        break;
      case _keyCode2.default.RETURN:
        if (focusedMenuItem) {
          // Simulate clicking on the anchor.
          focusedMenuItem.firstChild.click();
          this._hideDropdown();
        }
        break;
    }
  },

  _handleAddOption: function _handleAddOption(selectedOption) {
    var _props3 = this.props;
    var multiple = _props3.multiple;
    var labelKey = _props3.labelKey;
    var onChange = _props3.onChange;

    var selected;
    var text;

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
      showMenu: false,
      focusedMenuItem: null
    });
  }
});

module.exports = Typeahead;
//# sourceMappingURL=Typeahead.react.js.map