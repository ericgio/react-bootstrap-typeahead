'use strict';

import React, {PropTypes} from 'react';

import cx from 'classnames';
import {head} from 'lodash';
import {BACKSPACE, ESC, RIGHT, TAB} from './keyCode';
import listensToClickOutside from 'react-onclickoutside/decorator';

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
        style={{outline: 'none'}}>
        <input
          {...this.props}
          className={cx('bootstrap-typeahead-input-main', 'form-control', {
            'has-selection': !this.props.selected,
          })}
          onBlur={this._handleBlur}
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

  _handleBlur(e) {
    this.props.onBlur();
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
      case ESC:
      case TAB:
        this.refs.input.blur();
        break;
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

  handleClickOutside(e) {
    // Force blur so that input is no longer the active element. For some
    // reason, it's taking 2 clicks to fully blur the input otherwise.
    this.refs.input.blur();
  },
});

export default listensToClickOutside(TypeaheadInput);
