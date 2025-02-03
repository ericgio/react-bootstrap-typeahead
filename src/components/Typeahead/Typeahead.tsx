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

import usePagination from './usePagination';

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
  TypeaheadChildren,
  SelectEvent,
} from '../../types';

export interface RenderMenuProps extends MenuProps {
  newSelectionPrefix?: ReactNode;
  onItemSelect: (option: Option) => void;
  paginationText?: ReactNode;
  renderMenuItemChildren?: RenderMenuItemChildren;
}

export interface TypeaheadComponentProps extends TypeaheadProps {
  align?: Align;
  children?: TypeaheadChildren;
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
  /**
   * Maximum number of results to display by default. Mostly done for
   * performance reasons so as not to render too many DOM nodes in the case of
   * large data sets.
   */
  maxResults?: number;
  newSelectionPrefix?: ReactNode;
  /**
   * Invoked when the pagination menu item is clicked. Receives an event.
   */
  onPaginate?: (event: SelectEvent<HTMLElement>, shownResults: number) => void;
  options: Option[];
  /**
   * Give user the ability to display additional results if the number of
   * results exceeds `maxResults`.
   */
  paginate?: boolean;
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
      maxResults = 100,
      multiple,
      newSelectionPrefix,
      paginate = true,
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
      onItemSelect,
      onRemove,
      selected,
      text,
    } = rest;

    const { onPaginate, results } = usePagination({
      isMenuShown,
      labelKey,
      maxResults,
      onPaginate: props.onPaginate,
      paginate,
      results: rest.results,
      text,
    });

    const [referenceElement, setReferenceElement] =
      useState<HTMLElement | null>(null);

    // Menu
    const overlayProps = useOverlay(referenceElement, props);
    const renderMenu = props.renderMenu || defaultRenderMenu;
    const menuProps = {
      emptyLabel,
      maxHeight,
      newSelectionPrefix,
      onItemSelect,
      onPaginate,
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
