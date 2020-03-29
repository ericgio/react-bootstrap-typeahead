// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { findDOMNode } from 'react-dom';
import { RootCloseWrapper } from 'react-overlays';

import type { ElementRef, Node } from 'react';

import Overlay from '../core/Overlay';
import Typeahead from '../core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Token from './Token.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import { getOptionLabel, isFunction, isSizeLarge, pick, preventInputBlur } from '../utils';
import { checkPropType, deprecated, inputPropsType, sizeType } from '../propTypes';

import type { TypeaheadMenuProps } from './TypeaheadMenu.react';
import type {
  InputProps,
  MenuProps,
  Option,
  RefCallback,
  ReferenceElement,
  Size,
  Style,
  TypeaheadProps,
  TypeaheadManagerProps,
} from '../types';

type Props = TypeaheadProps & TypeaheadMenuProps & {
  bsSize?: Size,
  className?: string,
  clearButton: boolean,
  disabled?: boolean,
  instanceRef: RefCallback<any>,
  inputProps: Object,
  isInvalid: boolean,
  isLoading: boolean,
  isValid: boolean,
  renderInput: (InputProps, TypeaheadManagerProps) => Node,
  renderMenu: (Option[], TypeaheadMenuProps, TypeaheadProps) => Node,
  renderToken: (Option, Object & InputProps, number) => Node,
  size?: Size,
  style?: Style,
};

const propTypes = {
  /**
   * Specifies the size of the input.
   */
  bsSize: deprecated(sizeType, 'Use the `size` prop instead.'),
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

const defaultProps = {
  clearButton: false,
  inputProps: {},
  isInvalid: false,
  isLoading: false,
  isValid: false,
  renderMenu: (
    results: Option[],
    menuProps: TypeaheadMenuProps,
    props: TypeaheadManagerProps
  ) => (
    <TypeaheadMenu
      {...menuProps}
      labelKey={props.labelKey}
      options={results}
      text={props.text}
    />
  ),
  renderToken: (
    option: Option,
    props: TypeaheadManagerProps & InputProps,
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
  ),
};

function getOverlayProps(props: Props) {
  return pick(props, [
    'align',
    'dropup',
    'flip',
    'positionFixed',
  ]);
}

class TypeaheadComponent extends React.Component<Props> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  _referenceElement: ?ReferenceElement;

  render() {
    const {
      children,
      className,
      instanceRef,
      open,
      options,
      style,
    } = this.props;

    return (
      <Typeahead {...this.props} options={options} ref={instanceRef}>
        {({ getInputProps, ...props }) => {
          const { hideMenu, isMenuShown, results } = props;
          const auxContent = this._renderAux(props);

          return (
            <RootCloseWrapper
              disabled={open || !isMenuShown}
              onRootClose={hideMenu}>
              <div
                className={cx('rbt', { 'has-aux': !!auxContent }, className)}
                style={{
                  ...style,
                  outline: 'none',
                  position: 'relative',
                }}
                tabIndex={-1}>
                {this._renderInput({
                  ...getInputProps(this.props.inputProps),
                  ref: this.referenceElementRef,
                }, props)}
                <Overlay
                  {...getOverlayProps(this.props)}
                  isMenuShown={isMenuShown}
                  referenceElement={this._referenceElement}>
                  {(menuProps: MenuProps) => this._renderMenu(
                    results,
                    menuProps,
                    props
                  )}
                </Overlay>
                {auxContent}
                {isFunction(children) ? children(props) : children}
              </div>
            </RootCloseWrapper>
          );
        }}
      </Typeahead>
    );
  }

  referenceElementRef = (element: ?ReferenceElement) => {
    // Use `findDOMNode` here because it's easier and less fragile than
    // forwarding refs to the input's container.
    /* eslint-disable react/no-find-dom-node */
    // $FlowFixMe: `findDOMNode` could return Text or an Element.
    this._referenceElement = findDOMNode(element);
    /* eslint-enable react/no-find-dom-node */
  }

  _renderInput = (inputProps: InputProps, props: TypeaheadManagerProps) => {
    const {
      bsSize,
      isInvalid,
      isValid,
      multiple,
      renderInput,
      renderToken,
      size,
    } = this.props;

    if (isFunction(renderInput)) {
      return renderInput(inputProps, props);
    }

    const commonProps = {
      ...inputProps,
      isInvalid,
      isValid,
      size: bsSize || size,
    };

    if (!multiple) {
      return <TypeaheadInputSingle {...commonProps} />;
    }

    const { labelKey, onRemove, selected } = props;

    return (
      <TypeaheadInputMulti
        {...commonProps}
        selected={selected}>
        {selected.map((option, idx) => (
          renderToken(option, { ...commonProps, labelKey, onRemove }, idx)
        ))}
      </TypeaheadInputMulti>
    );
  }

  _renderMenu = (
    results: Option[],
    menuProps: MenuProps,
    props: TypeaheadManagerProps
  ) => {
    const {
      emptyLabel,
      id,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      // $FlowFixMe: Flow can't seem to find `renderMenu`
      renderMenu,
      renderMenuItemChildren,
    } = this.props;

    return renderMenu(results, {
      ...menuProps,
      emptyLabel,
      id,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      renderMenuItemChildren,
    }, props);
  }

  _renderAux = ({ onClear, selected }: TypeaheadManagerProps) => {
    const { bsSize, clearButton, disabled, isLoading, size } = this.props;

    let content;

    if (isLoading) {
      content = <Loader size={bsSize || size} />;
    } else if (clearButton && !disabled && selected.length) {
      content =
        <ClearButton
          size={bsSize || size}
          onClick={onClear}
          onFocus={(e) => {
            // Prevent the main input from auto-focusing again.
            e.stopPropagation();
          }}
          onMouseDown={preventInputBlur}
        />;
    }

    return content ?
      <div
        className={cx('rbt-aux', {
          'rbt-aux-lg': isSizeLarge(bsSize),
        })}>
        {content}
      </div> :
      null;
  }
}

export default forwardRef<* & Props, ElementRef<typeof Typeahead>>(
  (props, ref) => <TypeaheadComponent {...props} instanceRef={ref} />
);
