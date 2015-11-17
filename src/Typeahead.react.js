import _ from 'underscore';
import MenuItem from './MenuItem.react';
import React from 'react';

import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import keyCode from './keyCode';
import onClickOutside from 'react-onclickoutside';

var {cloneElement, PropTypes} = React;

require('./css/Typeahead.css');

/**
 * Typeahead
 */
var Typeahead = React.createClass({
  displayName: 'Typeahead',

  mixins: [onClickOutside],

  propTypes: {
    /**
     * Pre-selected options to display as tokens by default.
     */
    defaultSelected: PropTypes.array,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: PropTypes.string,
    /**
     * Maximum height of the dropdown, in pixels.
     */
    maxHeight: PropTypes.number,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
    /**
     * Function by which to sort the list of available options.
     */
    sortBy: PropTypes.func,
  },

  getDefaultProps: function() {
    var labelKey = 'label';
    return {
      defaultSelected: [],
      maxHeight: 300,
      labelKey: labelKey,
      sortBy: options => _.sortBy(options, labelKey),
    };
  },

  getInitialState: function() {
    var {defaultSelected, options, sortBy} = this.props;

    // Filter out any pre-selected options from the available set.
    var selectedIds = _.pluck(defaultSelected, 'id');
    var options = _.filter(options, (option) => {
      return selectedIds.indexOf(option.id) === -1;
    });

    return {
      focusedMenuItem: null,
      options: sortBy(options),
      selected: defaultSelected,
      showDropdown: false,
      text: ''
    };
  },

  render: function() {
    var child = this.props.children;
    if (React.Children.count(child) !== 1) {
      throw new Error(
        'ReactBootstrapTypeahead must have one and only one child.'
      );
    }

    var input = cloneElement(child, {
      labelKey: this.props.labelKey,
      onChange: this._handleTextChange,
      onFocus: this._handleFocus,
      onKeyDown: this._handleKeydown,
      onRemove: this._handleRemoveOption,
      selected: this.state.selected,
      text: this.state.text,
    });

    return (
      <div
        className={cx('bootstrap-typeahead', {
          'open': this.state.showDropdown
        })}>
        {input}
        {this._renderDropdown()}
      </div>
    );
  },

  _renderDropdown: function() {
    if (this.state.showDropdown) {
      return (
        <ul
          className="dropdown-menu"
          onKeyDown={this._handleKeydown}
          ref="list"
          style={{maxHeight: this.props.maxHeight + 'px'}}>
          {this._renderDropdownItems()}
        </ul>
      );
    }
  },

  _renderDropdownItems: function() {
    var text = this.state.text.toLowerCase();
    var options = _.filter(this.state.options, (option) => {
      var label = option[this.props.labelKey];
      return label.toLowerCase().indexOf(text) !== -1;
    });

    return options.length ?
      _.map(options, this._renderDropdownItem) :
      <MenuItem disabled>No matches found.</MenuItem>;
  },

  _renderDropdownItem: function(option, idx) {
    return (
      <MenuItem
        key={idx}
        onClick={this._handleAddOption.bind(this, option)}>
        {option[this.props.labelKey]}
      </MenuItem>
    );
  },

  _hideDropdown: function() {
    this.setState({
      showDropdown: false,
      focusedMenuItem: null
    });
  },

  _handleFocus: function() {
    this.setState({showDropdown: true});
  },

  _handleTextChange: function(e) {
    this.setState({
      showDropdown: true,
      text: e.target.value
    });
  },

  _handleKeydown: function(e) {
    var {focusedMenuItem} = this.state;

    switch (e.keyCode) {
      case keyCode.UP:
      case keyCode.DOWN:
        // Prevent page from scrolling when pressing up or down.
        e.preventDefault();

        // Try to get the menu list. It won't be there if there are no results.
        var list = this.refs.list && findDOMNode(this.refs.list);
        if (!list) {
          return;
        }

        if (e.keyCode === keyCode.UP) {
          // Get the previous item or go back to the bottom if we're at the top.
          focusedMenuItem =
            (focusedMenuItem && focusedMenuItem.previousSibling) ||
            list.lastChild;
        } else {
          // keyCode.DOWN
          // Get the next item or go back to the top if we're at the bottom.
          focusedMenuItem =
            (focusedMenuItem && focusedMenuItem.nextSibling) ||
            list.firstChild;
        }

        // Select the link in the menu item.
        focusedMenuItem.firstChild.focus();
        this.setState({focusedMenuItem: focusedMenuItem});
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
    var {multiple, onChange, sortBy} = this.props;

    // Remove the selected option from the list of possible options.
    var options = _.filter(this.state.options, function(option) {
      return option.id !== selectedOption.id;
    });

    var selected;
    if (multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = this.state.selected.concat(selectedOption);
    } else {
      // If only a single selection is allowed, completely replace the existing
      // selection with the new one and add the existing one back to the list
      // of possibilities.
      selected = [selectedOption];
      options = options.concat(this.state.selected);
    }

    this.setState({
      options: sortBy(options),
      selected: selected,
      showDropdown: false,
      text: ''
    });

    onChange && onChange(selected);
  },

  _handleRemoveOption: function(removedOption) {
    var selected = _.filter(this.state.selected, function(option) {
      return option.id !== removedOption.id;
    });

    // Merge the removed option back into the main list.
    var options = [removedOption].concat(this.state.options);

    this.setState({
      options: this.props.sortBy(options),
      selected: selected,
      showDropdown: false,
    });

    this.props.onChange && this.props.onChange(selected);
  },

  /**
   * From `onClickOutside` mixin.
   */
  handleClickOutside: function(e) {
    this._hideDropdown(); 
  },
});

module.exports = Typeahead;
