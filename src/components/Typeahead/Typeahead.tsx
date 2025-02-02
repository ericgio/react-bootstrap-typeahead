import cx from 'classnames';
import React, { CSSProperties, forwardRef, ReactNode, useState } from 'react';

import { TypeaheadContext, TypeaheadRef, useTypeahead } from '../../core';
import { useOverlay } from '../../hooks';

import ClearButton from '../ClearButton';
import Loader from '../Loader';
import Token from '../Token';
import TypeaheadInputMulti from '../TypeaheadInputMulti';
import TypeaheadInputSingle from '../TypeaheadInputSingle';
import TypeaheadMenu, { RenderMenuItemChildren } from '../TypeaheadMenu';
import { MenuProps } from '../Menu';

import {
  getOptionLabel,
  isFunction,
  isSizeLarge,
  preventInputBlur,
} from '../../utils';

import {
  Align,
  Option,
  RenderToken,
  RenderTokenProps,
  Size,
  TypeaheadInputProps,
  TypeaheadProps,
  TypeaheadChildProps,
} from '../../types';

export interface RenderMenuProps extends MenuProps {
  newSelectionPrefix?: ReactNode;
  paginationText?: ReactNode;
  renderMenuItemChildren?: RenderMenuItemChildren;
}

export interface TypeaheadComponentProps extends Partial<TypeaheadProps> {
  align?: Align;
  className?: string;
  /**
   * Displays a button to clear the input when there are selections.
   */
  clearButton?: boolean;
  disabled?: boolean;
  dropup?: boolean;
  emptyLabel?: ReactNode;
  flip?: boolean;
  /**
   * Adds the `is-invalid` classname to the `form-control`.
   */
  isInvalid?: boolean;
  /**
   * Indicate whether an asynchronous data fetch is happening.
   */
  isLoading?: boolean;
  /**
   * Adds the `is-valid` classname to the `form-control`.
   */
  isValid?: boolean;
  maxHeight?: string;
  newSelectionPrefix?: ReactNode;
  options: Option[];
  paginationText?: ReactNode;
  placeholder?: string;
  positionFixed?: boolean;
  /**
   * Callback for custom input rendering.
   */
  renderInput?: (
    inputProps: TypeaheadInputProps,
    props: TypeaheadChildProps
  ) => JSX.Element;
  /**
   * Callback for custom menu rendering.
   */
  renderMenu?: (
    results: Option[],
    menuProps: RenderMenuProps,
    state: TypeaheadChildProps
  ) => JSX.Element;
  renderMenuItemChildren?: RenderMenuItemChildren;
  /**
   * Callback for custom menu rendering.
   */
  renderToken?: RenderToken;
  /**
   * Specifies the size of the input.
   */
  size?: Size;
  style?: CSSProperties;
}

const defaultRenderMenu = (
  results: Option[],
  menuProps: RenderMenuProps,
  props: TypeaheadChildProps
) => (
  <TypeaheadMenu
    {...menuProps}
    labelKey={props.labelKey}
    options={results}
    text={props.text}
  />
);

const defaultRenderToken = (
  option: Option,
  props: RenderTokenProps,
  idx: number
) => (
  <Token
    disabled={props.disabled}
    key={idx}
    onRemove={props.onRemove}
    option={option}
    tabIndex={props.tabIndex}>
    {getOptionLabel(option, props.labelKey)}
  </Token>
);

const Typeahead = forwardRef<TypeaheadRef, TypeaheadComponentProps>(
  (props, ref) => {
    const { context, ...rest } = useTypeahead(props, ref);

    const {
      children,
      clearButton,
      disabled,
      emptyLabel,
      isLoading,
      isInvalid,
      isValid,
      maxHeight,
      multiple,
      newSelectionPrefix,
      paginationText,
      placeholder,
      renderMenuItemChildren,
      size,
    } = props;

    const {
      getInputProps,
      getMenuProps,
      isMenuShown,
      labelKey,
      onClear,
      onRemove,
      results,
      selected,
    } = rest;

    const [referenceElement, setReferenceElement] =
      useState<HTMLElement | null>(null);

    // Menu
    const overlayProps = useOverlay(referenceElement, props);
    const renderMenu = props.renderMenu || defaultRenderMenu;
    const menuProps = {
      emptyLabel,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      renderMenuItemChildren,
      ...overlayProps,
      ...getMenuProps(),
    };

    function renderInput() {
      // TODO: Add warnings for conflicting input props.
      const inputProps = {
        ...getInputProps({
          ...props.inputProps,
          disabled,
          placeholder,
        }),
        referenceElementRef: setReferenceElement,
      };

      if (props.renderInput) {
        return props.renderInput(inputProps, rest);
      }

      const commonProps = {
        ...inputProps,
        isInvalid,
        isValid,
        size,
      };

      if (!multiple) {
        return <TypeaheadInputSingle {...commonProps} />;
      }

      const renderToken = props.renderToken || defaultRenderToken;
      const tokenProps = {
        ...commonProps,
        labelKey,
        onRemove,
      };

      return (
        <TypeaheadInputMulti
          {...commonProps}
          placeholder={selected.length ? '' : inputProps.placeholder}
          selected={selected}>
          {selected.map((option, idx) => renderToken(option, tokenProps, idx))}
        </TypeaheadInputMulti>
      );
    }

    let auxContent;
    if (isLoading) {
      auxContent = <Loader />;
    } else if (clearButton && !disabled && selected?.length) {
      auxContent = (
        <ClearButton
          onClick={onClear}
          onMouseDown={preventInputBlur}
          size={size}
        />
      );
    }

    return (
      <TypeaheadContext.Provider value={context}>
        <div
          className={cx(
            'rbt',
            {
              'has-aux': !!auxContent,
              'is-invalid': isInvalid,
              'is-valid': isValid,
            },
            props.className
          )}
          style={{
            ...props.style,
            outline: 'none',
            position: 'relative',
          }}
          tabIndex={-1}>
          {renderInput()}
          {isMenuShown && renderMenu(results, menuProps, rest)}
          {auxContent && (
            <div className={cx('rbt-aux', { 'rbt-aux-lg': isSizeLarge(size) })}>
              {auxContent}
            </div>
          )}
          {isFunction(children) ? children(rest) : children}
        </div>
      </TypeaheadContext.Provider>
    );
  }
);

export default Typeahead;
