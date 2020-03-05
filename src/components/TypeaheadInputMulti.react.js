// @flow

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import cx from 'classnames';
import React, { type Node } from 'react';

import Input from './Input.react';

import { isSelectable } from '../utils';
import hintContainer from '../containers/hintContainer';
import withClassNames from '../containers/withClassNames';

import { BACKSPACE } from '../constants';

import type { InputProps, Option } from '../types';

type Props = {
  ...InputProps,
  children: Node,
  selected: Option[],
};

const HintedInput = hintContainer(Input);

class TypeaheadInputMulti extends React.Component<Props> {
  wrapperRef = React.createRef<HTMLDivElement>();
  _input: ?HTMLInputElement;

  render() {
    const {
      children,
      className,
      inputClassName,
      inputRef,
      placeholder,
      selected,
      ...props
    } = this.props;

    return (
      <div
        className={cx('rbt-input-multi', className)}
        disabled={props.disabled}
        onClick={this._handleContainerClickOrFocus}
        onFocus={this._handleContainerClickOrFocus}
        tabIndex={-1}>
        <div className="rbt-input-wrapper" ref={this.wrapperRef}>
          {children}
          <HintedInput
            {...props}
            className={inputClassName}
            onKeyDown={this._handleKeyDown}
            placeholder={selected.length ? '' : placeholder}
            ref={this.getInputRef}
            style={{
              backgroundColor: 'transparent',
              border: 0,
              boxShadow: 'none',
              cursor: 'inherit',
              outline: 'none',
              padding: 0,
              width: '100%',
              zIndex: 1,
            }}
          />
        </div>
      </div>
    );
  }

  getInputRef = (input: ?HTMLInputElement) => {
    this._input = input;
    this.props.inputRef(input);
  }

  /**
   * Forward click or focus events on the container element to the input.
   */
  _handleContainerClickOrFocus = (e: SyntheticEvent<HTMLElement>) => {
    // Don't focus the input if it's disabled.
    if (this.props.disabled) {
      e.currentTarget.blur();
      return;
    }

    // Move cursor to the end if the user clicks outside the actual input.
    const inputNode = this._input;
    if (!inputNode) {
      return;
    }

    if (e.currentTarget !== inputNode && isSelectable(inputNode)) {
      inputNode.selectionStart = inputNode.value.length;
    }

    inputNode.focus();
  }

  _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, selected, value } = this.props;

    switch (e.keyCode) {
      case BACKSPACE:
        if (e.currentTarget === this._input && selected.length && !value) {
          // Prevent browser from going back.
          e.preventDefault();

          // If the input is selected and there is no text, focus the last
          // token when the user hits backspace.
          if (this.wrapperRef.current) {
            const { children } = this.wrapperRef.current;
            const lastToken = children[children.length - 2];
            lastToken && lastToken.focus();
          }
        }
        break;
      default:
        break;
    }

    onKeyDown(e);
  }
}

export default withClassNames(TypeaheadInputMulti);
