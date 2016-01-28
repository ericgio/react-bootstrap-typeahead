'use strict';

import React from 'react';

import cx from 'classnames';
import {head, isEmpty} from 'lodash';
import keyCode from './keyCode';
import onClickOutside from 'react-onclickoutside';

const {PropTypes} = React;

require('../css/Typeahead.css');

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
const TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  mixins: [onClickOutside],

  propTypes: {
    filteredOptions: PropTypes.array,
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.object,
    text: PropTypes.string,
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
          className={cx('bootstrap-typeahead-input-main', 'form-control', {
            'has-selection': !this.props.selected
          })}
          onKeyDown={this._handleKeydown}
          ref="input"
          style={{
            backgroundColor: 'transparent',
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}
          type="text"
          value={this._getInputValue()}
        />
        <input
          className="bootstrap-typeahead-input-hint form-control"
          style={{
            borderColor: 'transparent',
            bottom: 0,
            display: 'block',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 0,
          }}
          value={this._getHintText()}
        />
      </div>
    );
  },

  _getInputValue: function() {
    var {labelKey, selected, text} = this.props;
    return selected ? selected[labelKey] : text;
  },

  _getHintText: function() {
    var {filteredOptions, labelKey, text} = this.props;
    var firstOption = head(filteredOptions);

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
    var {filteredOptions, onAdd, onRemove, selected} = this.props;

    switch (e.keyCode) {
      case keyCode.ESC:
        this.refs.input.blur();
        break;
      case keyCode.RIGHT:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected) {
          onAdd && onAdd(head(filteredOptions));
        }
        break;
      case keyCode.BACKSPACE:
        // Remove the selection if we start deleting it.
        selected && onRemove && onRemove(selected);
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
