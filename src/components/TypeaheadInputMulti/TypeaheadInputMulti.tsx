/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import cx from 'classnames';
import React, { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import Hint from '../Hint';
import Input from '../Input';

import { isSelectable, propsWithBsClassName } from '../../utils';

import { Option, TypeaheadInputProps } from '../../types';

export interface TypeaheadInputMultiProps extends TypeaheadInputProps {
  children: ReactNode;
  selected: Option[];
}

function TypeaheadInputMulti(props: TypeaheadInputMultiProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputElem = React.useRef<HTMLInputElement | null>(null);

  const {
    children,
    className,
    inputClassName,
    inputRef,
    referenceElementRef,
    selected,
    ...rest
  } = propsWithBsClassName<TypeaheadInputMultiProps>(props);

  function getInputRef(input: HTMLInputElement | null) {
    inputElem.current = input;
    props.inputRef(input);
  }

  /**
   * Forward click or focus events on the container element to the input.
   */
  function handleContainerClickOrFocus(
    e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>
  ) {
    // Don't focus the input if it's disabled.
    if (props.disabled) {
      e.currentTarget.blur();
      return;
    }

    const inputNode = inputElem.current;
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
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && selected.length && !props.value) {
      // Prevent browser from going back.
      e.preventDefault();

      // If the input is selected and there is no text, focus the last
      // token when the user hits backspace.

      const wrapperChildren = wrapperRef.current?.children;
      if (wrapperChildren?.length) {
        const lastToken = wrapperChildren[
          wrapperChildren.length - 2
        ] as HTMLElement;
        lastToken?.focus();
      }
    }

    props.onKeyDown && props.onKeyDown(e);
  }

  return (
    <div
      className={cx('rbt-input-multi', { disabled: props.disabled }, className)}
      onClick={handleContainerClickOrFocus}
      onFocus={handleContainerClickOrFocus}
      ref={referenceElementRef}
      tabIndex={-1}>
      <div className="rbt-input-wrapper" ref={wrapperRef}>
        {children}
        <Hint>
          <Input
            {...rest}
            className={inputClassName}
            onKeyDown={handleKeyDown}
            ref={getInputRef}
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

export default TypeaheadInputMulti;
