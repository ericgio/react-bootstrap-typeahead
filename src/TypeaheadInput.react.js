'use strict';

import React, {PropTypes} from 'react';

import cx from 'classnames';
import {head} from 'lodash';
import {BACKSPACE, RIGHT} from './keyCode';

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
const TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    disabled: PropTypes.bool,
    filteredOptions: PropTypes.array,
    labelKey: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.object,
    text: PropTypes.string,
  },

  render() {
    return (
      <div
        className={cx('bootstrap-typeahead-input', this.props.className)}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        style={{outline: 'none'}}
        tabIndex={-1}>
        <input
          {...this.props}
          className={cx('bootstrap-typeahead-input-main', 'form-control', {
            'has-selection': !this.props.selected,
          })}
          onKeyDown={this._handleKeydown}
          ref="input"
          style={{
            backgroundColor: !this.props.disabled && 'transparent',
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
            boxShadow: 'none',
            display: 'block',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 0,
          }}
          tabIndex={-1}
          type="text"
          value={this._getHintText()}
        />
      </div>
    );
  },

  _getInputValue() {
    const {labelKey, selected, text} = this.props;
    return selected ? selected[labelKey] : text;
  },

  _getHintText() {
    const {filteredOptions, labelKey, text} = this.props;
    let firstOption = head(filteredOptions);

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
  _handleInputFocus(e) {
    this.refs.input.focus();
  },

  _handleKeydown(e) {
    const {filteredOptions, onAdd, onRemove, selected} = this.props;

    switch (e.keyCode) {
      case RIGHT:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected) {
          onAdd && onAdd(head(filteredOptions));
        }
        break;
      case BACKSPACE:
        // Remove the selection if we start deleting it.
        selected && onRemove && onRemove(selected);
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  },
});

export default TypeaheadInput;
