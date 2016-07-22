'use strict';

import React, {PropTypes} from 'react';

import cx from 'classnames';
import {head, pick} from 'lodash';
import {BACKSPACE, RIGHT, TAB} from './keyCode';

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
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    selected: PropTypes.object,
    text: PropTypes.string,
  },

  getInitialState() {
    return {
      isFocused: false,
    };
  },

  render() {
    const {className, disabled, selected, text} = this.props;
    const inputProps = pick(this.props, [
      'disabled',
      'onChange',
      'onFocus',
      'placeholder',
    ]);

    return (
      <div
        className={cx('bootstrap-typeahead-input', className)}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        style={{outline: 'none'}}
        tabIndex={-1}>
        <input
          {...inputProps}
          className={cx('bootstrap-typeahead-input-main', 'form-control', {
            'has-selection': !selected,
          })}
          onBlur={this._handleBlur}
          onKeyDown={this._handleKeydown}
          ref="input"
          style={{
            backgroundColor: !disabled && 'transparent',
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}
          type="text"
          value={text}
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

  _getHintText() {
    const {filteredOptions, labelKey, text} = this.props;
    const firstOption = head(filteredOptions);
    const firstOptionString = firstOption && firstOption[labelKey];

    // Only show the hint if...
    if (
      // ...the input is focused.
      this.state.isFocused &&
      // ...the input contains text.
      text &&
      // ...the input text corresponds to the beginning of the first option.
      firstOptionString &&
      firstOptionString.toLowerCase().indexOf(text.toLowerCase()) === 0
    ) {
      // Text matching is case-insensitive, so to display the hint correctly,
      // splice the input text with the rest of the actual string.
      return text + firstOptionString.slice(
        text.length,
        firstOptionString.length
      );
    }

    return '';
  },

  _handleBlur(e) {
    this.setState({isFocused: false});
    this.props.onBlur && this.props.onBlur(e);
  },

  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus(e) {
    this.setState({isFocused: true});
    this.refs.input.focus();
  },

  _handleKeydown(e) {
    const {filteredOptions, onAdd, onRemove, selected} = this.props;

    switch (e.keyCode) {
      case RIGHT:
      case TAB:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected) {
          e.preventDefault();
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
