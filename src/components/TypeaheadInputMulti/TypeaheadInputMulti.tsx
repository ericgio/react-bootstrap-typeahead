/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import cx from 'classnames';
import React, { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import Hint from '../Hint';
import Input from '../Input';

import { isSelectable } from '../../utils';
import withClassNames from '../../behaviors/classNames';

import { Option, RefElement, TypeaheadInputProps } from '../../types';

export interface TypeaheadInputMultiProps extends TypeaheadInputProps {
  children: ReactNode;
  selected: Option[];
}

class TypeaheadInputMulti extends React.Component<TypeaheadInputMultiProps> {
  wrapperRef = React.createRef<HTMLDivElement>();
  _input: RefElement<HTMLInputElement> = null;

  render() {
    const {
      children,
      className,
      inputClassName,
      inputRef,
      placeholder,
      referenceElementRef,
      selected,
      shouldSelectHint,
      ...props
    } = this.props;

    return (
      <div
        className={cx('rbt-input-multi', className)}
        onClick={this._handleContainerClickOrFocus}
        onFocus={this._handleContainerClickOrFocus}
        ref={referenceElementRef}
        tabIndex={-1}>
        <div className="rbt-input-wrapper" ref={this.wrapperRef}>
          {children}
          <Hint shouldSelect={shouldSelectHint}>
            <Input
              {...props}
              className={inputClassName}
              onClick={this._handleClick}
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
          </Hint>
        </div>
      </div>
    );
  }

  getInputRef = (input: RefElement<HTMLInputElement>) => {
    this._input = input;
    this.props.inputRef(input);
  };

  _handleClick = (e: MouseEvent<HTMLInputElement>) => {
    // Prevent clicks on the input from bubbling up to the container,
    // which then re-focuses the input.
    e.stopPropagation();
    this.props.onClick && this.props.onClick(e);
  };

  /**
   * Forward click or focus events on the container element to the input.
   */
  _handleContainerClickOrFocus = (
    e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>
  ) => {
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

    if (isSelectable(inputNode)) {
      inputNode.selectionStart = inputNode.value.length;
    }

    inputNode.focus();
  };

  _handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, selected, value } = this.props;

    switch (e.key) {
      case 'Backspace':
        if (selected.length && !value) {
          // Prevent browser from going back.
          e.preventDefault();

          // If the input is selected and there is no text, focus the last
          // token when the user hits backspace.
          if (this.wrapperRef.current) {
            const { children } = this.wrapperRef.current;
            const lastToken = children[children.length - 2];
            lastToken && (lastToken as HTMLElement).focus();
          }
        }
        break;
      default:
        break;
    }

    onKeyDown && onKeyDown(e);
  };
}

export default withClassNames(TypeaheadInputMulti);
