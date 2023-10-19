import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { CSSProperties, forwardRef, ReactNode, Ref } from 'react';

import Typeahead from '../../core/Typeahead';

import ClearButton from '../ClearButton';
import Loader from '../Loader';
import Overlay, { OverlayRenderProps } from '../Overlay';
import RootClose from '../RootClose';
import Token from '../Token/Token';
import TypeaheadInputMulti from '../TypeaheadInputMulti';
import TypeaheadInputSingle from '../TypeaheadInputSingle';
import TypeaheadMenu, {
  RenderMenuItemChildren,
  TypeaheadMenuProps,
} from '../TypeaheadMenu';

import {
  getOptionLabel,
  isFunction,
  isSizeLarge,
  pick,
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

export interface RenderMenuProps
  extends Omit<
    TypeaheadMenuProps,
    'labelKey' | 'options' | 'renderMenuItemChildren' | 'text'
  > {
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
  instanceRef?: Ref<Typeahead>;
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

const overlayPropKeys = [
  'align',
  'dropup',
  'flip',
  'positionFixed',
] as (keyof TypeaheadComponentProps)[];

function getOverlayProps(props: TypeaheadComponentProps) {
  return pick(props, overlayPropKeys);
}

class TypeaheadComponent extends React.Component<TypeaheadComponentProps> {
  static propTypes = propTypes;

  _referenceElement: HTMLElement | null = null;

  render() {
    const { children, className, instanceRef, open, options, style } =
      this.props;

    return (
      <Typeahead {...this.props} options={options} ref={instanceRef}>
        {(props: TypeaheadManagerChildProps) => {
          const { hideMenu, isMenuShown, results } = props;
          const auxContent = this._renderAux(props);

          return (
            <RootClose disabled={open || !isMenuShown} onRootClose={hideMenu}>
              {(ref) => (
                <div
                  className={cx(
                    'rbt',
                    {
                      'has-aux': !!auxContent,
                      'is-invalid': this.props.isInvalid,
                      'is-valid': this.props.isValid,
                    },
                    className
                  )}
                  ref={ref}
                  style={{
                    ...style,
                    outline: 'none',
                    position: 'relative',
                  }}
                  tabIndex={-1}>
                  {this._renderInput(
                    {
                      ...props.getInputProps(this.props.inputProps),
                      referenceElementRef: this.referenceElementRef,
                    },
                    props
                  )}
                  <Overlay
                    {...getOverlayProps(this.props)}
                    isMenuShown={isMenuShown}
                    referenceElement={this._referenceElement}>
                    {(menuProps: OverlayRenderProps) =>
                      this._renderMenu(results, menuProps, props)
                    }
                  </Overlay>
                  {auxContent}
                  {isFunction(children) ? children(props) : children}
                </div>
              )}
            </RootClose>
          );
        }}
      </Typeahead>
    );
  }

  referenceElementRef = (referenceElement: HTMLElement | null) => {
    this._referenceElement = referenceElement;
  };

  _renderInput = (
    inputProps: TypeaheadInputProps,
    props: TypeaheadManagerChildProps
  ) => {
    const { isInvalid, isValid, multiple, renderInput, renderToken, size } =
      this.props;

    if (isFunction(renderInput)) {
      return renderInput(inputProps, props);
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

    return (
      <TypeaheadInputMulti
        {...commonProps}
        placeholder={selected.length ? '' : inputProps.placeholder}
        selected={selected}>
        {selected.map((option, idx) =>
          (renderToken || defaultRenderToken)(
            option,
            { ...commonProps, labelKey, onRemove },
            idx
          )
        )}
      </TypeaheadInputMulti>
    );
  };

  _renderMenu = (
    results: Option[],
    menuProps: OverlayRenderProps,
    props: TypeaheadManagerChildProps
  ) => {
    const {
      emptyLabel,
      id,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      renderMenu,
      renderMenuItemChildren,
    } = this.props;

    return (renderMenu || defaultRenderMenu)(
      results,
      {
        ...menuProps,
        emptyLabel,
        id,
        maxHeight,
        newSelectionPrefix,
        paginationText,
        renderMenuItemChildren,
      },
      props
    );
  };

  _renderAux = ({ onClear, selected }: TypeaheadManagerChildProps) => {
    const { clearButton, disabled, isLoading = 'false', size } = this.props;

    let content;

    if (isLoading) {
      content = <Loader />;
    } else if (clearButton && !disabled && selected.length) {
      content = (
        <ClearButton
          onClick={onClear}
          onMouseDown={preventInputBlur}
          size={size}
        />
      );
    }

    return content ? (
      <div className={cx('rbt-aux', { 'rbt-aux-lg': isSizeLarge(size) })}>
        {content}
      </div>
    ) : null;
  };
}

export default forwardRef<Typeahead, TypeaheadComponentProps>((props, ref) => (
  <TypeaheadComponent {...props} instanceRef={ref} />
));
