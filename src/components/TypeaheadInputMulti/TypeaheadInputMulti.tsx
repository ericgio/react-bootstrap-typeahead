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
          <Hint>
            <Input
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
          </Hint>
        </div>
      </div>
    );
  }

  getInputRef = (input: RefElement<HTMLInputElement>) => {
    this._input = input;
    this.props.inputRef(input);
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

    const inputNode = this._input;
    if (
      !inputNode ||
      // Ignore if the clicked element is a child of the container, ie: a token
      // or the input itself.
      (e.currentTarget.contains(e.target as HTMLElement) &&
        e.currentTarget !== e.target)
    ) {
      return;
    }

    if (isSelectable(inputNode)) {
      // Move cursor to the end if the user clicks outside the actual input.
      inputNode.selectionStart = inputNode.value.length;
    }

    inputNode.focus();
  };

  _handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, selected, value } = this.props;

    if (e.key === 'Backspace' && selected.length && !value) {
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

    onKeyDown && onKeyDown(e);
  };
}

export default withClassNames(TypeaheadInputMulti);
