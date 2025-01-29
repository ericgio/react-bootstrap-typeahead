import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { CSSProperties, forwardRef, ReactNode, useState } from 'react';

import TypeaheadManager from '../../core/TypeaheadManager';
import useRootClose from '../../core/useRootClose';
import useTypeahead, { TypeaheadRef } from '../../core/useTypeahead';

import ClearButton from '../ClearButton';
import Loader from '../Loader';
import { useOverlay } from '../Overlay';
import Token from '../Token/Token';
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

import { checkPropType, inputPropsType, sizeType } from '../../propTypes';

import {
  Align,
  Option,
  RenderToken,
  RenderTokenProps,
  Size,
  TypeaheadInputProps,
  TypeaheadProps,
  TypeaheadManagerChildProps,
} from '../../types';

export interface RenderMenuProps extends MenuProps {
  newSelectionPrefix?: ReactNode;
  paginationText?: ReactNode;
  renderMenuItemChildren?: RenderMenuItemChildren;
}

export interface TypeaheadComponentProps extends Partial<TypeaheadProps> {
  align?: Align;
  className?: string;
  clearButton?: boolean;
  disabled?: boolean;
  dropup?: boolean;
  emptyLabel?: ReactNode;
  flip?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
  maxHeight?: string;
  newSelectionPrefix?: ReactNode;
  options: Option[];
  paginationText?: ReactNode;
  placeholder?: string;
  positionFixed?: boolean;
  renderInput?: (
    inputProps: TypeaheadInputProps,
    props: TypeaheadManagerChildProps
  ) => JSX.Element;
  renderMenu?: (
    results: Option[],
    menuProps: RenderMenuProps,
    state: TypeaheadManagerChildProps
  ) => JSX.Element;
  renderMenuItemChildren?: RenderMenuItemChildren;
  renderToken?: RenderToken;
  size?: Size;
  style?: CSSProperties;
}

const propTypes = {
  /**
   * Displays a button to clear the input when there are selections.
   */
  clearButton: PropTypes.bool,
  /**
   * Props to be applied directly to the input. `onBlur`, `onChange`,
   * `onFocus`, and `onKeyDown` are ignored.
   */
  inputProps: checkPropType(PropTypes.object, inputPropsType),
  /**
   * Bootstrap 4 only. Adds the `is-invalid` classname to the `form-control`.
   */
  isInvalid: PropTypes.bool,
  /**
   * Indicate whether an asynchronous data fetch is happening.
   */
  isLoading: PropTypes.bool,
  /**
   * Bootstrap 4 only. Adds the `is-valid` classname to the `form-control`.
   */
  isValid: PropTypes.bool,
  /**
   * Callback for custom input rendering.
   */
  renderInput: PropTypes.func,
  /**
   * Callback for custom menu rendering.
   */
  renderMenu: PropTypes.func,
  /**
   * Callback for custom menu rendering.
   */
  renderToken: PropTypes.func,
  /**
   * Specifies the size of the input.
   */
  size: sizeType,
};

const defaultRenderMenu = (
  results: Option[],
  menuProps: RenderMenuProps,
  props: TypeaheadManagerChildProps
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

function Typeahead(
  props: TypeaheadComponentProps & TypeaheadManagerChildProps
) {
  const {
    children,
    clearButton,
    disabled,
    emptyLabel,
    isLoading,
    id,
    isInvalid,
    isValid,
    maxHeight,
    multiple,
    newSelectionPrefix,
    paginationText,
    renderMenuItemChildren,
    results,
    size,
  } = props;

  const rootElementRef = useRootClose(props.hideMenu, {
    disabled: props.open || !props.isMenuShown,
  });
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );

  // Menu
  const overlayProps = useOverlay(referenceElement, props);
  const renderMenu = props.renderMenu || defaultRenderMenu;
  const menuProps = {
    ...overlayProps,
    emptyLabel,
    id,
    maxHeight,
    newSelectionPrefix,
    paginationText,
    renderMenuItemChildren,
  };

  function renderInput() {
    const inputProps = {
      ...props.getInputProps(props.inputProps),
      referenceElementRef: setReferenceElement,
    };

    if (props.renderInput) {
      return props.renderInput(inputProps, props);
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

    const { labelKey, onRemove, selected } = props;
    const renderToken = props.renderToken || defaultRenderToken;
    const tokenProps = { ...commonProps, labelKey, onRemove };

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
  } else if (clearButton && !disabled && props.selected.length) {
    auxContent = (
      <ClearButton
        onClick={props.onClear}
        onMouseDown={preventInputBlur}
        size={size}
      />
    );
  }

  return (
    <div
      className={cx(
        'rbt',
        {
          'has-aux': !!auxContent,
          'is-invalid': props.isInvalid,
          'is-valid': props.isValid,
        },
        props.className
      )}
      ref={rootElementRef}
      style={{
        ...props.style,
        outline: 'none',
        position: 'relative',
      }}
      tabIndex={-1}>
      {renderInput()}
      {props.isMenuShown && renderMenu(results, menuProps, props)}
      {auxContent && (
        <div className={cx('rbt-aux', { 'rbt-aux-lg': isSizeLarge(size) })}>
          {auxContent}
        </div>
      )}
      {isFunction(children) ? children(props) : children}
    </div>
  );
}

Typeahead.propTypes = propTypes;

const TypeaheadExport = forwardRef<TypeaheadRef, TypeaheadComponentProps>(
  (props, ref) => {
    const typeaheadProps = useTypeahead(props, ref);

    return (
      <TypeaheadManager {...typeaheadProps}>
        {(managerProps) => <Typeahead {...props} {...managerProps} />}
      </TypeaheadManager>
    );
  }
);

export default TypeaheadExport;
