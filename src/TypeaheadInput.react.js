import React from 'react';

import cx from 'classnames';
import {first} from 'lodash/array';
import keyCode from './keyCode';

var {PropTypes} = React;

require('./css/Typeahead.css');

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    filteredOptions: PropTypes.array,
    focusedOption: PropTypes.string,
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
          className={cx('bootstrap-typeahead-input-main', 'form-control')}
          onChange={this._handleChange}
          onKeyDown={this._handleKeydown}
          ref={(ref) => this._input = ref}
          type="text"
          value={this.props.text}
        />
        <input
          className={cx('bootstrap-typeahead-input-hint', 'form-control')}
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
      this._input === document.activeElement &&
      // ...there's input text.
      text &&
      // ...the input text corresponds to the beginning of the first option.
      firstOption &&
      firstOption[labelKey].indexOf(text) === 0
    ) {
      return firstOption[labelKey];
    }
  },

  _handleChange: function(e) {
    this.props.onChange && this.props.onChange(e);
  },

  _handleInputFocus: function(e) {
    this._input.focus();
  },

  _handleKeydown: function(e) {
    switch (e.keyCode) {
      case keyCode.ESC:
        this._input.blur();
        break;
      case keyCode.RIGHT:
      case keyCode.TAB:
        // Autocomplete the selection if there's a hint.
        if (this._getHintText()) {
          var {filteredOptions, onAdd} = this.props;
          onAdd && onAdd(first(filteredOptions));
        }
        break;
      case keyCode.BACKSPACE:
        // Remove the selection if we start deleting it.
        var {onRemove, selected} = this.props;
        first(selected) && onRemove && onRemove(first(selected));
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },
});

module.exports = TypeaheadInput;
