'use strict';

import React, {PropTypes} from 'react';

import cx from 'classnames';
import {head, pick} from 'lodash';
import {RIGHT, TAB} from './keyCode';

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
const TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    disabled: PropTypes.bool,
    labelKey: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    selected: PropTypes.array,
    text: PropTypes.string,
  },

  getInitialState() {
    return {
      isFocused: false,
    };
  },

  render() {
    const {className, disabled, labelKey, selected, text} = this.props;
    const inputProps = pick(this.props, [
      'disabled',
      'onChange',
      'onFocus',
      'placeholder',
    ]);

    let selectedItem = !!selected.length && head(selected);
    let inputText = selectedItem[labelKey] || text;

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
          onChange={this._handleChange}
          onKeyDown={this._handleKeydown}
          ref="input"
          style={{
            backgroundColor: !disabled && 'transparent',
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}
          type="text"
          value={inputText}
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
    const {options, labelKey, text} = this.props;
    const firstOption = head(options);
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
    this.props.onBlur(e);
  },

  _handleChange(e) {
    // Clear any selections when text is entered.
    const {onRemove, selected} = this.props;
    !!selected.length && onRemove(head(selected));

    this.props.onChange(e.target.value);
  },

  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus(e) {
    this.setState({isFocused: true});
    this.refs.input.focus();
  },

  _handleKeydown(e) {
    const {options, onAdd, selected} = this.props;

    switch (e.keyCode) {
      case RIGHT:
      case TAB:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected.length) {
          e.preventDefault();
          onAdd && onAdd(head(options));
        }
        break;
    }

    this.props.onKeyDown(e);
  },
});

export default TypeaheadInput;
