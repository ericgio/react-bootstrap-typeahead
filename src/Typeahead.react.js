import React from 'react';

import cx from 'classnames';
import {findDOMNode} from 'react-dom';
import {first} from 'lodash/array';
import {filter, findWhere} from 'lodash/collection';
import {isEqual} from 'lodash/lang';
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
     * Whether or not multiple selections are allowed.
     */
    multiple: PropTypes.bool,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
  },

  getDefaultProps: function() {
    return {
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
    };
  },

  getInitialState: function() {
    var {defaultSelected, labelKey, multiple} = this.props;
    var selected = multiple ? defaultSelected : defaultSelected.slice(0, 1);

    return {
      focusedMenuItem: null,
      selected: selected,
      showMenu: false,
      text: (!multiple && first(selected) && first(selected)[labelKey]) || ''
    };
  },

  render: function() {
    var {children, labelKey, multiple, options} = this.props;
    var {selected, text} = this.state;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.
    var filteredOptions = filter(options, (option) => {
      return !(
        option[labelKey].toLowerCase().indexOf(text.toLowerCase()) === -1 ||
        multiple && findWhere(selected, option)
      );
    });

    var input = cloneElement(children[0], {
      filteredOptions: filteredOptions,
      labelKey: labelKey,
      onAdd: this._handleAddOption,
      onChange: this._handleTextChange,
      onFocus: this._handleFocus,
      onKeyDown: this._handleKeydown,
      onRemove: this._handleRemoveOption,
      ref: 'input',
      selected: selected,
      text: text,
    });

    var menu;
    if (this.state.showMenu) {
      menu = cloneElement(children[1], {
        onClick: this._handleAddOption,
        onKeyDown: this._handleKeydown,
        options: filteredOptions,
        ref: 'menu',
      });
    }

    return (
      <div className="bootstrap-typeahead open">
        {input}
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
      selected: selected,
      showMenu: false,
      text: text,
    });

    onChange && onChange(selected);
  },

  _handleRemoveOption: function(removedOption) {
    var selected = filter(this.state.selected, function(option) {
      return !isEqual(option, removedOption);
    });

    this.setState({
      selected: selected,
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
