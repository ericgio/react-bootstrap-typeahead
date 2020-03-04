// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

import Overlay from '../core/Overlay';
import Typeahead from '../core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import RootClose from './RootClose.react';
import Token from './Token.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import { getOptionLabel, isFunction, isSizeLarge, pick, preventInputBlur } from '../utils';
import { checkPropType, inputPropsType, sizeType } from '../propTypes';

import type { TypeaheadMenuProps } from './TypeaheadMenu.react';
import type {
  InputProps,
  MenuProps,
  Option,
  ReferenceElement,
  Size,
  Style,
  TypeaheadProps,
  TypeaheadManagerProps,
} from '../types';

type Props = TypeaheadProps & TypeaheadMenuProps & {
  size?: Size,
  className?: string,
  clearButton: boolean,
  disabled?: boolean,
  inputProps: Object,
  isInvalid: boolean,
  isLoading: boolean,
  isValid: boolean,
  renderInput: (InputProps, TypeaheadManagerProps) => React.Node,
  renderMenu: (Option[], TypeaheadMenuProps, TypeaheadProps) => React.Node,
  renderToken: (Option, Object & InputProps, number) => React.Node,
  style?: Style,
};

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

  _instance: ?Typeahead;
  _referenceElement: ?ReferenceElement;

  render() {
    // Explicitly pass `options` so Flow doesn't complain...
    const { children, className, open, options, style } = this.props;

    return (
      <Typeahead
        {...this.props}
        options={options}
        ref={(instance) => this._instance = instance}>
        {({ getInputProps, ...props }) => {
          const { isMenuShown, onHide, results } = props;
          const auxContent = this._renderAux(props);

          return (
            <RootClose
              disabled={open || !isMenuShown}
              onRootClose={onHide}>
              {(ref) => (
                <div
                  className={cx('rbt', { 'has-aux': !!auxContent }, className)}
                  ref={ref}
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
              )}
            </RootClose>
          );
        }}
      </Typeahead>
    );
  }

  getInstance = () => {
    return this._instance;
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
      size,
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
    const { clearButton, disabled, isLoading, size } = this.props;

    let content;

    if (isLoading) {
      content = <Loader />;
    } else if (clearButton && !disabled && selected.length) {
      content =
        <ClearButton
          onClick={onClear}
          onFocus={(e) => {
            // Prevent the main input from auto-focusing again.
            e.stopPropagation();
          }}
          onMouseDown={preventInputBlur}
          size={size}
        />;
    }

    return content ?
      <div
        className={cx('rbt-aux', { 'rbt-aux-lg': isSizeLarge(size) })}>
        {content}
      </div> :
      null;
  }
}

export default TypeaheadComponent;
