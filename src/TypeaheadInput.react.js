'use strict';

import cx from 'classnames';
import {head} from 'lodash';
import React, {PropTypes} from 'react';

import TextInput from './TextInput.react';

import {RIGHT, TAB} from './utils/keyCode';

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
const TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  /**
   * In addition to the propTypes below, the following props are automatically
   * passed down by `Typeahead.react`:
   *
   *  - activeIndex
   *  - activeItem
   *  - hasAux
   *  - hintText
   *  - labelKey
   *  - onAdd
   *  - onBlur
   *  - onChange
   *  - onClick
   *  - onFocus
   *  - onKeydown
   *  - onRemove
   *  - selected
   *  - value
   */
  propTypes: {
    /**
     * Whether to disable the input and any selection, if present.
     */
    disabled: PropTypes.bool,
    /**
     * Name property for the input.
     */
    name: PropTypes.string,
    /**
     * Placeholder text for the input.
     */
    placeholder: PropTypes.string,
  },

  getInitialState() {
    return {
      isFocused: false,
    };
  },

  componentDidUpdate(prevProps, prevState) {
    const {activeIndex, value} = this.props;
    if (activeIndex !== prevProps.activeIndex) {
      this._input.getInstance().selectionStart = value.length;
    }
  },

  render() {
    const {
      bsSize,
      className,
      disabled,
      hasAux,
      hintText,
      name,
      onFocus,
      placeholder,
      selected,
      value,
    } = this.props;

    const inputProps = {
      bsSize,
      disabled,
      hasAux,
      name,
      onFocus,
      placeholder,
      value,
    };

    return (
      <div
        className={cx('bootstrap-typeahead-input', className)}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        style={{
          outline: 'none',
          position: 'relative',
        }}
        tabIndex={-1}>
        <TextInput
          {...inputProps}
          autoComplete="off"
          className={cx('bootstrap-typeahead-input-main', {
            'has-selection': !!selected.length,
          })}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onKeyDown={this._handleKeydown}
          ref={input => this._input = input}
          style={{
            backgroundColor: !disabled && 'transparent',
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}
        />
        <TextInput
          bsSize={bsSize}
          className={cx('bootstrap-typeahead-input-hint')}
          hasAux={hasAux}
          style={{
            borderColor: 'transparent',
            bottom: 0,
            boxShadow: 'none',
            display: 'block',
            opacity: 0.6,
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 0,
          }}
          tabIndex={-1}
          value={this.state.isFocused ? hintText : ''}
        />
      </div>
    );
  },

  blur() {
    this._input.getInstance().blur();
  },

  focus() {
    this._handleInputFocus();
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
    this._input.getInstance().focus();
  },

  _handleKeydown(e) {
    const {
      activeItem,
      hintText,
      initialItem,
      onAdd,
      selected,
      value,
    } = this.props;

    switch (e.keyCode) {
      case RIGHT:
      case TAB:
        const cursorPos = this._input.getInstance().selectionStart;

        // Autocomplete the selection if all of the following are true:
        if (
          this.state.isFocused &&
          // There's a hint or a menu item is highlighted.
          (hintText || activeItem) &&
          // There's no current selection.
          !selected.length &&
          // The input cursor is at the end of the text string when the user
          // hits the right arrow key.
          !(e.keyCode === RIGHT && cursorPos !== value.length)
        ) {
          e.preventDefault();

          const selectedOption = hintText ? initialItem : activeItem;

          onAdd && onAdd(selectedOption);
        }
        break;
    }

    this.props.onKeyDown(e);
  },
});

export default TypeaheadInput;
