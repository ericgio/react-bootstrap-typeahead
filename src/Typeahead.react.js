var React = require('react');

var TokenizerInput = require('./TokenizerInput.react');
var TypeaheadInput = require('./TypeaheadInput.react');
var TypeaheadMenu = require('./TypeaheadMenu.react');

var cx = require('classnames');
var {findDOMNode} = require('react-dom');
var {find, head, isEmpty, isEqual} = require('lodash');
var keyCode = require('./keyCode');
var onClickOutside = require('react-onclickoutside');

var {cloneElement, PropTypes} = React;

require('./css/Typeahead.css');

/**
 * Typeahead
 */
var Typeahead = React.createClass({
  displayName: 'Typeahead',

  mixins: [onClickOutside],

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
    selected: PropTypes.array,
  },

  getDefaultProps: function() {
    return {
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
      selected: [],
    };
  },

  getInitialState: function() {
    var {defaultSelected, labelKey, multiple, selected} = this.props;
    var selected = !isEmpty(defaultSelected) ? defaultSelected : selected;

    return {
      focusedMenuItem: null,
      selected: selected,
      showMenu: false,
      text: ''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (!isEqual(this.props.selected, nextProps.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({selected: nextProps.selected});
    }

    if (this.props.multiple !== nextProps.multiple) {
      this.setState({text: ''});
    }
  },

  render: function() {
    var {children, labelKey, multiple, options} = this.props;
    var {selected, text} = this.state;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.
    var filteredOptions = options.filter((option) => {
      return !(
        option[labelKey].toLowerCase().indexOf(text.toLowerCase()) === -1 ||
        multiple && find(selected, option)
      );
    });

    var menu;
    if (this.state.showMenu) {
      menu =
        <TypeaheadMenu
          emptyLabel={this.props.emptyLabel}
          labelKey={labelKey}
          maxHeight={this.props.maxHeight}
          onClick={this._handleAddOption}
          onKeyDown={this._handleKeydown}
          options={filteredOptions}
          ref="menu"
        />
    }

    var InputComponent = TokenizerInput;

    if (!multiple) {
      InputComponent = TypeaheadInput;
      selected = head(selected);
      text = (selected && selected[labelKey]) || text;
    }

    return (
      <div
        className="bootstrap-typeahead open"
        style={{position: 'relative'}}>
        <InputComponent
          filteredOptions={filteredOptions}
          labelKey={labelKey}
          onAdd={this._handleAddOption}
          onChange={this._handleTextChange}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeydown}
          onRemove={this._handleRemoveOption}
          placeholder={this.props.placeholder}
          ref="input"
          selected={selected}
          text={text}
        />
        {menu}
      </div>
    );
  },

  _handleFocus: function() {
    this.setState({showMenu: true});
  },

  _handleTextChange: function(e) {
    this.setState({
      showMenu: true,
      text: e.target.value
    });
  },

  _handleKeydown: function(e) {
    var {focusedMenuItem, text} = this.state;

    switch (e.keyCode) {
      case keyCode.UP:
      case keyCode.DOWN:
      case keyCode.TAB:
        // Prevent page from scrolling when pressing up or down.
        e.preventDefault();

        // Look for the menu. It won't be there if there are no results.
        var menu = this.refs.menu && findDOMNode(this.refs.menu);
        if (!menu) {
          return;
        }

        if (e.keyCode === keyCode.UP) {
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
          findDOMNode(this.refs.input).focus();
        }

        this.setState({focusedMenuItem});
        break;
      case keyCode.ESC:
        // Prevent things like unintentionally closing dialogs.
        e.stopPropagation();
        this._hideDropdown();
        break;
      case keyCode.RETURN:
        if (focusedMenuItem) {
          // Simulate clicking on the anchor.
          focusedMenuItem.firstChild.click();
          this._hideDropdown();
        }
        break;
    }
  },

  _handleAddOption: function(selectedOption) {
    var {multiple, labelKey, onChange} = this.props;

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
      selected,
      showMenu: false,
      text,
    });

    onChange && onChange(selected);
  },

  _handleRemoveOption: function(removedOption) {
    var selected = this.state.selected.slice();
    selected = selected.filter((option) => !isEqual(option, removedOption));

    this.setState({
      selected,
      showMenu: false,
    });

    this.props.onChange && this.props.onChange(selected);
  },

  /**
   * From `onClickOutside` mixin.
   */
  handleClickOutside: function(e) {
    this._hideDropdown();
  },

  _hideDropdown: function() {
    this.setState({
      showMenu: false,
      focusedMenuItem: null
    });
  },
});

module.exports = Typeahead;
