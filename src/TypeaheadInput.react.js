import React from 'react';

import cx from 'classnames';
import {first} from 'lodash/array';
import keyCode from './keyCode';
import onClickOutside from 'react-onclickoutside';

var {PropTypes} = React;

require('./css/Typeahead.css');

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  mixins: [onClickOutside],

  propTypes: {
    filteredOptions: PropTypes.array,
    focusedOption: PropTypes.string,
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.array,
  },

  render: function() {
    return (
      <div
        className={cx('bootstrap-typeahead-input', this.props.className)}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        tabIndex={0}>
        <input
          {...this.props}
          className={cx({
            'has-selection': this.props.selected.length
          }, 'bootstrap-typeahead-input-main', 'form-control')}
          onKeyDown={this._handleKeydown}
          ref="input"
          type="text"
          value={this.props.text}
        />
        <input
          className="bootstrap-typeahead-input-hint form-control"
          value={this._getHintText()}
        />
      </div>
    );
  },

  _getHintText: function() {
    var {filteredOptions, labelKey, text} = this.props;
    var firstOption = first(filteredOptions);

    // Only show the hint if...
    if (
      // ...the input is focused.
      this.refs.input === document.activeElement &&
      // ...the input contains text.
      text &&
      // ...the input text corresponds to the beginning of the first option.
      firstOption &&
      firstOption[labelKey].indexOf(text) === 0
    ) {
      return firstOption[labelKey];
    }
  },

  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus: function(e) {
    this.refs.input.focus();
  },

  _handleKeydown: function(e) {
    switch (e.keyCode) {
      case keyCode.ESC:
        this.refs.input.blur();
        break;
      case keyCode.RIGHT:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !this.props.selected.length) {
          var {filteredOptions, onAdd} = this.props;
          onAdd && onAdd(first(filteredOptions));
        }
        break;
      case keyCode.BACKSPACE:
        // Remove the selection if we start deleting it.
        var {onRemove, selected} = this.props;
        selected.length && onRemove && onRemove(first(selected));
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },

  handleClickOutside: function(e) {
    // Force blur so that input is no longer the active element. For some
    // reason, it's taking 2 clicks to fully blur the input otherwise.
    this.refs.input.blur();
  },
});

module.exports = TypeaheadInput;
