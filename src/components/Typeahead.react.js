// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { RootCloseWrapper } from 'react-overlays';

import Overlay from '../core/Overlay';
import Typeahead from '../core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Token from './Token.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import { getOptionLabel, isFunction, isSizeLarge, preventInputBlur } from '../utils';
import { checkPropType, inputPropsType, sizeType } from '../propTypes';

import type { TypeaheadMenuProps } from './TypeaheadMenu.react';
import type {
  InputProps,
  MenuProps,
  Option,
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
   * Specifies the size of the input.
   */
  bsSize: sizeType,
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

class TypeaheadComponent extends React.Component<Props> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  _instance: ?Typeahead;

  render() {
    // Explicitly pass `options` so Flow doesn't complain...
    const { children, className, open, options, style } = this.props;

    return (
      <Typeahead
        {...this.props}
        options={options}
        ref={(instance) => this._instance = instance}>
        {({ getInputProps, getOverlayProps, state }) => {
          const auxContent = this._renderAux(state);

          return (
            <RootCloseWrapper
              disabled={open || !state.isMenuShown}
              onRootClose={state.onHide}>
              <div
                className={cx('rbt', { 'has-aux': !!auxContent }, className)}
                style={{
                  ...style,
                  outline: 'none',
                  position: 'relative',
                }}
                tabIndex={-1}>
                {this._renderInput(getInputProps(this.props.inputProps), state)}
                <Overlay {...getOverlayProps(this.props)}>
                  {(menuProps: MenuProps) => this._renderMenu(
                    state.results,
                    menuProps,
                    state
                  )}
                </Overlay>
                {auxContent}
                {isFunction(children) ? children(state) : children}
              </div>
            </RootCloseWrapper>
          );
        }}
      </Typeahead>
    );
  }

  getInstance = () => {
    return this._instance;
  }

  _renderInput = (inputProps: InputProps, state: TypeaheadManagerProps) => {
    const {
      bsSize,
      isInvalid,
      isValid,
      multiple,
      renderInput,
      renderToken,
    } = this.props;

    if (isFunction(renderInput)) {
      return renderInput(inputProps, state);
    }

    const props = {
      ...inputProps,
      bsSize,
      isInvalid,
      isValid,
    };

    if (!multiple) {
      return <TypeaheadInputSingle {...props} />;
    }

    const { labelKey, onRemove, selected } = state;

    return (
      <TypeaheadInputMulti
        {...props}
        selected={selected}>
        {selected.map((option, idx) => (
          renderToken(option, { ...props, labelKey, onRemove }, idx)
        ))}
      </TypeaheadInputMulti>
    );
  }

  _renderMenu = (
    results: Option[],
    menuProps: MenuProps,
    state: TypeaheadManagerProps
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
    }, state);
  }

  _renderAux = (state: TypeaheadManagerProps) => {
    const { bsSize, clearButton, disabled, isLoading } = this.props;
    const { onClear, selected } = state;

    let content;

    if (isLoading) {
      content = <Loader bsSize={bsSize} />;
    } else if (clearButton && !disabled && selected.length) {
      content =
        <ClearButton
          bsSize={bsSize}
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

export default TypeaheadComponent;
